"use strict";

const Boom = require(`boom`);
const Promise = require(`bluebird`);

const Errors = require(`./errors`);

class Prerequisites {
  /**
  * confirmRecordExists(model[, mode, requestKey, databasekey])
  *
  * Returns a HAPI pre-req package configured to
  * to fetch all matching records of the passed `model`,
  * using data from the route parameters or the request payload
  * to build the query.
  *
  * @param {Object} model - Bookshelf model for querying
  * @param {Object} config - Contains configuration options for the query:
  *     mode {String} - 'param' or 'payload' (if omitted, returns all records)
  *     requestKey {String} - key of the param/payload
  *     databaseKey {String} - key of the database model
  *
  * @return {Promise} - Promise fullfilled when the record is found
  */
  static confirmRecordExists(model, config) {
    config = config || {};
    const dbKey = config.databaseKey || config.requestKey;
    const requestKey = config.requestKey;

    function getRecordsFromDB(requestKeyValue) {
      const queryOptions = {};

      if (requestKey) {
        queryOptions.where = {
          [ dbKey ]: requestKeyValue
        };
      }

      const fetchOptions = {};

      if (config.columns) {
        fetchOptions.columns = config.columns;
      }

      return model.query(queryOptions).fetchAll(fetchOptions);
    }

    function getRecordsFromCache(server, requestKeyValue) {
      const cacheConfig = config.cache;
      const cacheMethodName = cacheConfig.methodName;
      const cacheMethod = server.methods[cacheMethodName];

      return Promise.fromCallback(next => {

        return cacheMethod.call(
          server.app.cacheContexts[cacheMethodName],
          requestKeyValue,
          next
        );
      })
      .then(cachedValue => cacheConfig.postProcess(requestKeyValue, cachedValue));
    }

    return {
      assign: `records`,
      method(req, reply) {
        const result = Promise.resolve()
        .then(function() {
          const requestKeyValue = requestKey && config.mode === `param` ? req.params[requestKey] : req.payload[requestKey];

          if (config.cache) {
            return getRecordsFromCache(req.server, requestKeyValue);
          }

          return getRecordsFromDB(requestKeyValue);
        })
        .then(function(records) {
          if (!records || records.length === 0) {
            throw Boom.notFound(null, {
              debug: true,
              error: `resource not found`
            });
          }

          return records;
        })
        .catch(Errors.generateErrorResponse);

        return reply(result);
      }
    };
  }

  /**
  * validateUser()
  *
  * Ensures that the user sending the request exists in the
  * current context. This means that the user should have hit the
  * /users/login route first
  *
  * @return {Promise} - Promise fullfilled when the user has been found
  */
  static validateUser() {
    return {
      assign: `user`,
      method(request, reply) {
        const usernameParam = request.auth.credentials.username;

        const result = Promise.fromCallback(next => {
          return request.server.methods.user(usernameParam, next);
        })
        .then(authenticatedUser => {
          if (!authenticatedUser) {
            // This case means our auth logic failed unexpectedly
            throw Boom.badImplementation(null, {
              error: `authenticated user doesn't exist (mayday!)`
            });
          }

          return authenticatedUser;
        })
        .catch(Errors.generateErrorResponse);

        return reply(result);
      }
    };
  }

  /**
  * validateOwnership([recordsAreNotModels, fetchUser, userIsNotModel])
  *
  * Ensures the authenticated user is the owner of the
  * resource being manipulated or requested.
  *
  * @param {boolean} recordsAreNotModels - If true, indicates that the records
  * contained in the request prerequisites are not Bookshelf Models but simple
  * javascript object representations of them
  * @param {Function} fetchUser - The function to use to fetch the user that
  * owns the resource represented by the simple javascript object in the
  * request prerequisites. This function is required if recordsAreNotModels
  * is set to true
  * @param {boolean} userIsNotModel - If true, indicates that the user returned
  * by the `fetchUser` function is not a Bookshelf Model but a simple
  * javascript object representation of one.
  *
  * @return {Promise} - Promise fullfilled when the user has been confirmed to
  * be the owner of the resource requested
  */
  static validateOwnership(recordsAreNotModels, fetchUser, userIsNotModel) {
    if (recordsAreNotModels && typeof fetchUser !== `function`) {
      throw new Error(`fetchUser needs to be a function provided if recordsAreNotModels is set to true`);
    }

    return {
      method(request, reply) {
        const records = request.pre.records;
        const resource = recordsAreNotModels ? records[0] : records.models[0];
        const authenticatedUser = request.pre.user;

        const result = Promise.resolve()
        .then(function() {
          if (typeof fetchUser === `function`) {
            return fetchUser(resource, request.server);
          }

          // Check if the resource is the owning user, otherwise fetch
          // the user it's owned by
          if (resource.tableName === `users`) {
            return resource;
          }

          return resource.user().query({}).fetch();
        })
        .then(function(owner) {
          if (!owner) {
            // This should never ever happen
            throw Boom.badImplementation(null, {
              error: `An owning user can't be found (mayday!)`
            });
          }

          return owner;
        })
        .then(function(owner) {
          const ownerId = userIsNotModel ? owner.id : owner.get(`id`);

          if (ownerId !== authenticatedUser.id) {
            throw Boom.unauthorized(null, {
              debug: true,
              error: `User doesn't own the resource requested`
            });
          }
        })
        .catch(Errors.generateErrorResponse);

        return reply(result);
      }
    };
  }

  /**
  * validateExportPermission()
  *
  * Ensures that the resource for which this request was authorized for
  * matches the resource requested.
  *
  * @return {Promise} - Resolved if the authorization matches the requested
  * resource, rejected otherwise.
  */
  static validateExportPermission() {
    return {
      method(request, reply) {
        const requestedId = request.pre.records.models[0].get(`id`);
        const { authorizedId } = request.auth.credentials;

        if (requestedId === authorizedId) {
          return reply(Promise.resolve());
        }

        return reply(Errors.generateErrorResponse(
          Boom.forbidden(
            `Requested resource with id ${requestedId} does not match the resource token provided`
          )
        ));
      }
    };
  }

  /**
  * validateCreationPermission([getUserForModelFn])
  *
  * Ensures the authenticated user is the owner of the
  * resource (or its parent) being created.
  *
  * @param {Function} getUserForModelFn - A function that will fetch a user
  * object as a simple javascript object for the model (or its parent) that
  * this prerequisite function is validating creation permission for.
  *
  * @return {Promise} - Promise fullfilled when the user has been confirmed to
  * be the owner of the resource being created (or its parent)
  */
  static validateCreationPermission(getUserForModelFn) {
    return {
      method(request, reply) {
        const result = Promise.fromCallback(next => {
          return request.server.methods.user(request.auth.credentials.username, next);
        })
        .then(function(user) {
          if (!user) {
            // This case means our auth logic failed unexpectedly
            throw Boom.badImplementation(null, {
              error: `User doesn't exist!`
            });
          }

          // Check to see if there's a direct reference to `user_id` in the payload
          if (!getUserForModelFn) {
            if (user.id !== request.payload.user_id) {
              throw Boom.unauthorized(null, {
                debug: true,
                error: `User doesn't own the resource being referenced`
              });
            }

            return;
          }

          return getUserForModelFn(request)
          .then(function(owner) {
            if (!owner) {
              throw Boom.notFound(null, {
                debug: true,
                error: `Parent foreign key passed in payload (most likely project_id) does not reference an existing model`
              });
            }

            if (user.id !== owner.id) {
              throw Boom.unauthorized(null, {
                debug: true,
                error: `User doesn't own the resource being referenced`
              });
            }
          });
        })
        .catch(Errors.generateErrorResponse);

        reply(result);
      }
    };
  }

  /**
  * trackTemporaryFile()
  *
  * Stores the path to a temporary file in req.app for clearing after a request completes
  * and in req.pre for use in the handler
  *
  * @return {String} - Path to the temporary file
  */
  static trackTemporaryFile() {
    return {
      assign: `tmpFile`,

      /* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^reply$" }]*/
      method(request, reply) {
        const buffer = request.payload.buffer;

        // Store the paths for after the request completes
        request.app.tmpFile = buffer.path;

        reply(buffer.path);
      }
    };
  }
}

module.exports = Prerequisites;
