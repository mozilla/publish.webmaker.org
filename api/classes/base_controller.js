var Boom = require('boom');
var Promise = require('bluebird');
var errors = require('./errors');

function BaseController(model)  {
  this.Model = model;
}

BaseController.prototype.data = function(req) {
  // Abstract base method,
  // formats data for database entry
};

BaseController.prototype.getOne = function(req, reply) {
  var record = req.pre.records.models[0];
  reply(req.generateResponse(record.toJSON())
    .code(200));
};

BaseController.prototype.getAll = function(req, reply) {
  reply(req.generateResponse(req.pre.records.toJSON()));
};

BaseController.prototype.update = function(req, reply) {
  var reqData = this.data(req);

  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    record.set(reqData);
    if (!record.hasChanged()) {
      throw Boom.notFound();
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
    .forge(this.data(req))
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
  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    record.destroy();

    return req.generateResponse(record.toJSON())
      .code(204);
  })
  .catch(errors.generateErrorResponse);

  reply(result);
};

module.exports = BaseController;
