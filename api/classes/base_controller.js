var Boom = require('boom');

function BaseController(model)  {
  this.Model = model;
}

BaseController.prototype.getAll = function(req, reply) {
  var result = this.Model.fetchAll()
  .then(function(records) {
    if (!records) { throw Boom.notFound(); }
    return req.generateResponse(records.toJSON())
      .code(200);
  });
  return reply(result);
};

BaseController.prototype.getOne = function(req, reply) {
  var result = this.Model.query({
    where: {
      id: req.params.id
    }
  }).fetch()
  .then(function(record) {
    if (!record) { throw Boom.notFound(); }
    return req.generateResponse(record.toJSON())
      .code(200);
  });
  return reply(result);
};

BaseController.prototype.create = function(req, reply) {
  var result = this.Model.forge(this.payload(req.payload))
    .save()
    .then(function(record) {
      if (!record) { throw Boom.notFound(); }
      return req.generateResponse(record.toJSON())
        .code(201);
    });
  return reply(result);
};

BaseController.prototype.update = function(req, reply) {
  var result = this.Model.query({
    where: {
      id: req.params.id
    }
  }).save(this.payload(req.payload), {
    method: 'update',
    patch: 'true'
  }).then(function(record) {
    if (!record) { throw Boom.notFound(); }
    return req.generateResponse(record.toJSON())
      .code(201);
  });
  return reply(result);
};

BaseController.prototype.delete = function(req, reply) {
  var result = this.Model.query({
    where: {
      id: req.params.id
    }
  }).fetch().then(function(record) {
    record.destroy();
    return req.generateResponse(record.toJSON())
      .code(204);
  });
  return reply(result);
};

module.exports = BaseController;
