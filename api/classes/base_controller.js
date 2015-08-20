var Boom = require('boom');
var Promise = require('bluebird');
var archiver = require('archiver');
var errors = require('./errors');

function BaseController(model)  {
  this.Model = model;
}

BaseController.prototype.formatRequestData = function(req) {
  // Abstract base method,
  // formats data for database entry
};

BaseController.prototype.formatResponseData = function(model) {
  // Base method to format data that will be sent in the response
  // By default, it returns the model as is
  return model;
};

BaseController.prototype.getOne = function(req, reply) {
  var record = this.formatResponseData(req.pre.records.models[0].toJSON());
  reply(req.generateResponse(record)
    .code(200));
};

BaseController.prototype.getAll = function(req, reply) {
  var records = req.pre.records.toJSON().map(this.formatResponseData);
  reply(req.generateResponse(records));
};

BaseController.prototype.update = function(req, reply) {
  var reqData = this.formatRequestData(req);

  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    record.set(reqData);
    if (!record.hasChanged()) {
      return record;
    }

    return record
      .save(record.changed, { patch: true, method: 'update' });
  })
  .then(function (updatedState) {
    return req.generateResponse(updatedState.toJSON()).code(200);
  })
  .catch(errors.generateErrorResponse);

  reply(result);
};

BaseController.prototype.create = function(req, reply) {
  var result = this.Model
    .forge(this.formatRequestData(req))
    .save()
    .then(function(record) {
      if (!record) { throw Boom.notFound(); }
      return req.generateResponse(record.toJSON())
        .code(201);
    })
    .catch(errors.generateErrorResponse);
  reply(result);
};

BaseController.prototype.delete = function(req, reply) {
  var record = req.pre.records.models[0];

  var result = Promise.resolve().then(function() {
    return record.destroy();
  })
  .then(function() {
    return req.generateResponse(record.toJSON())
      .code(204);
  })
  .catch(errors.generateErrorResponse);

  reply(result);
};

BaseController.prototype.getAllAsMeta = function(req, reply) {
  reply(req.generateResponse(req.pre.records.toJSON()));
};

BaseController.prototype.getAllAsTar = function(req, reply) {
  var files = req.pre.records.models;
  var self = this;

  function createTarStream() {
    var archive = archiver('tar');

    return Promise.map(files, function(file) {
      return self.Model.query({
        where: {
          id: file.get('id')
        },
        columns: ['buffer']
      }).fetch()
      .then(function(model) {
        archive.append(model.get('buffer'), { name: file.get('path') });
      });
    }).then(function() {
      archive.finalize();

      return archive;
    });
  }

  return reply(createTarStream())
    .header('Content-Type', 'application/x-tar');
};


module.exports = BaseController;
