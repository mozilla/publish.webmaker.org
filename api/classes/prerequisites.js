var Boom = require('boom');
var Promise = require('bluebird');

var Users = require('../modules/users/model');
var errors = require('./errors');

var prerequisites = {};

/**
 * confirmRecordExists(model[, mode, requestKey, databasekey])
 *
 * Returns a HAPI pre-req package configured to
 * to fetch all matching records of the passed `model`,
 * using data from the route parameters or the request payload
 * to build the query.
 *
 * @param {Object} model - Bookshelf model for querying
 * @param {String} mode - 'param' or 'payload' (if omitted, returns all records)
 * @param {String} requestKey - key of the param/payload
 * @param {String} databaseKey - key of the database model
 *
 * @return {Promise}
 */
prerequisites.confirmRecordExists = function(model, config) {
  config = config || {};
  config.databaseKey = config.databaseKey || config.requestKey;

  return {
    assign: 'records',
    method: function(req, reply) {
      var queryOptions = {};
      if (config.requestKey) {
        queryOptions.where = {};

        if (config.mode === 'param') {
          queryOptions.where[config.databaseKey] = req.params[config.requestKey];
        } else {
          queryOptions.where[config.databaseKey] = req.payload[config.requestKey];
        }
      }

      var fetchOptions;
      if (config.columns) {
        fetchOptions = { columns: config.columns };
      }

      var result = model.query(queryOptions)
        .fetchAll(fetchOptions)
        .then(function(records) {
          if (records.length === 0) { throw Boom.notFound(); }

          return records;
        })
        .catch(errors.generateErrorResponse);

      return reply(result);
    }
  };
};

/**
 * validateUser()
 *
 * Ensures that the user sending the request exists in the
 * current context. This means that the user should have hit the
 * /users/login route first
 *
 * @return {Promise}
 */
prerequisites.validateUser = function() {
  return {
    assign: 'user',
    method: function validateUser(req, reply) {
      var result = Users.query({
        where: {
          name: req.auth.credentials.username
        }
      }).fetch()
      .then(function(authenticatedUser) {
        if (!authenticatedUser) {
          // This case means our auth logic failed unexpectedly
          throw Boom.badImplementation('User doesn\'t exist!');
        }

        return authenticatedUser;
      })
      .catch(errors.generateErrorResponse);

      return reply(result);
    }
  };
};

/**
 * validateOwnership()
 *
 * Ensures the authenticated user is the owner of the
 * resource being manipulated or requested.
 *
 * @return {Promise}
 */
prerequisites.validateOwnership = function() {
  return {
    method: function validateOwnership(req, reply) {
      var resource = req.pre.records.models[0];
      var authenticatedUser = req.pre.user;

      var result = Promise.resolve().then(function() {
        // Check if the resource is the owning user, otherwise fetch
        // the user it's owned by
        if (resource.tableName === 'users') {
          return resource;
        }
        return resource.user().query({})
          .fetch()
          .then(function(owner) {
            if (!owner) {
              // This should never ever happen
              throw Boom.badImplementation('An owning user could not be found. Mayday!');
            }
            return owner;
          });
      })
      .then(function(owner) {
        if (owner.get('id') !== authenticatedUser.get('id')) {
          throw Boom.unauthorized();
        }
      })
      .catch(errors.generateErrorResponse);

      return reply(result);
    }
  };
};

/**
 * validateCreationPermission([foreignKey, model])
 *
 * Ensures the authenticated user is the owner of the
 * resource being created.
 *
 * @param {Object} foreignKey - Foreign key of an existing resource
 * @param {Object} model - Bookshelf model for querying
 *
 * @return {Promise}
 */
prerequisites.validateCreationPermission = function(foreignKey, model) {
  return {
    method: function validateCreationPermission(req, reply) {
      var result = Users.query({
        where: {
          name: req.auth.credentials.username
        }
      }).fetch()
      .then(function(userRecord) {
        if (!userRecord) {
          // This case means our auth logic failed unexpectedly
          throw Boom.badImplementation('User doesn\'t exist!');
        }

        // Check to see if there's a direct reference to `user_id` in the payload
        if (!foreignKey) {
          if (userRecord.get('id') !== req.payload.user_id) {
            throw Boom.unauthorized();
          }
          return;
        }

        var query = { where: {} };
        query.where.id = req.payload[foreignKey];

        return model.query(query).fetch()
          .then(function(record) {
            if (!record) {
              throw Boom.notFound('Foreign key doesn\'t reference an existing record');
            }

            if (userRecord.get('id') !== record.get('user_id')) {
              throw Boom.unauthorized();
            }
          });
      })
      .catch(errors.generateErrorResponse);

      reply(result);
    }
  };
};

/**
 * trackTemporaryFile()
 *
 * Stores the path to a temporary file in req.app for clearing after a request completes
 * and in req.pre for use in the handler
 */
prerequisites.trackTemporaryFile = function() {
  return {
    assign: 'tmpFile',
    method: function trackTemporaryFile(req, reply) {
      var buffer = req.payload.buffer;

      // Store the paths for after the request completes
      req.app.tmpFile = buffer.path;

      reply(buffer.path);
    }
  };
};

module.exports = prerequisites;
