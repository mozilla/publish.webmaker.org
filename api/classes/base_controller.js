"use strict";

const Boom = require(`boom`);
const Promise = require(`bluebird`);
const Tar = require(`tar-stream`);
const Errors = require(`./errors`);

// This method is used to format the response data for
// HTTP methods that modify data (e.g. POST, PUT, etc.)
// so that we only send back data that is relevant and do
// not unnecessarily serialize all the data from the database.
function defaultFormatResponse(model) {
  return model;
}

class BaseController {
  constructor(Model) {
    this.Model = Model;
  }

  formatRequestData(request) { // eslint-disable-line no-unused-vars
    // Abstract base method; formats data for database entry
    throw new Error(`formatRequestData has not been implemented in subclass`);
  }

  formatResponseData(model) {
    // Base method to format data that will be sent in the response
    // By default, it returns the model as is
    return model;
  }

  _create(request, reply, formatResponse) {
    const requestData = this.formatRequestData(request);

    if (typeof formatResponse !== `function`) {
      formatResponse = defaultFormatResponse;
    }

    return this.Model
    .forge(requestData)
    .save()
    .then(function(record) {
      if (!record) {
        throw Boom.notFound(null, {
          error: `Bookshelf error creating a resource`
        });
      }

      return request.generateResponse(
        formatResponse(record).toJSON()
      ).code(201);
    })
    .catch(Errors.generateErrorResponse);
  }

  // `formatResponse` is an optional processing function that can be passed
  // in to modify what is sent in the response body. If no function is
  // provided, the full model for the current method is used in the response.
  create(request, reply, formatResponse) {
    return reply(this._create(request, reply, formatResponse));
  }

  getOne(request, reply) {
    const record = request.pre.records.models[0].toJSON();

    reply(
      request.generateResponse(
        this.formatResponseData(record)
      ).code(200)
    );
  }

  getAll(request, reply) {
    const records = request.pre.records.toJSON();

    reply(
      request.generateResponse(
        records.map(this.formatResponseData)
      )
    );
  }

  getAllAsMeta(request, reply) {
    reply(
      request.generateResponse(
        request.pre.records.toJSON()
      )
    );
  }

  // NOTE: creating the tarball for a project can be a lengthy process, so
  // we do it in multiple turns of the event loop, so that other requests
  // don't get blocked.
  getAllAsTar(request, reply) {
    const files = request.pre.records.models;
    const tarStream = Tar.pack();
    const Model = this.Model;

    function processFile(file) {
      return Model.query({
        where: {
          id: file.get(`id`)
        },
        columns: [`buffer`]
      })
      .fetch()
      .then(function(model) {
        return new Promise(function(resolve) {
          setImmediate(function() {
            tarStream.entry(
              {
                name: file.get(`path`)
              },
              model.get(`buffer`)
            );

            resolve();
          });
        });
      });
    }

    setImmediate(function() {
      Promise.map(files, processFile, { concurrency: 2 })
      .then(function() { return tarStream.finalize(); })
      .catch(Errors.generateErrorResponse);
    });

    // Normally this type would be application/x-tar, but IE refuses to
    // decompress a gzipped stream when this is the type.
    reply(tarStream)
    .header(`Content-Type`, `application/octet-stream`);
  }

  _update(request, reply, formatResponse) {
    const requestData = this.formatRequestData(request);

    if (typeof formatResponse !== `function`) {
      formatResponse = defaultFormatResponse;
    }

    return Promise.resolve().then(function() {
      const record = request.pre.records.models[0];

      record.set(requestData);
      if (!record.hasChanged()) {
        return record;
      }

      return record.save(
        record.changed,
        {
          patch: true,
          method: `update`
        }
      );
    })
    .then(function(updatedState) {
      return request.generateResponse(
        formatResponse(updatedState).toJSON()
      ).code(200);
    })
    .catch(Errors.generateErrorResponse);
  }

  // `formatResponse` is an optional processing function that can be passed
  // in to modify what is sent in the response body. If no function is
  // provided, the full model for the current method is used in the response.
  update(request, reply, formatResponse) {
    return reply(this._update(request, reply, formatResponse));
  }

  _delete(request, reply) { // eslint-disable-line no-unused-vars
    const record = request.pre.records.models[0];

    return record.destroy()
    .then(() => request.generateResponse().code(204))
    .catch(Errors.generateErrorResponse);
  }

  delete(request, reply) {
    return reply(this._delete(request, reply));
  }
}

module.exports = BaseController;
