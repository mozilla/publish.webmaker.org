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
  var result = this.Model
    .forge(this.data(req))
    .save()
    .then(function(record) {
      if (!record) { throw Boom.notFound(); }
      return req.generateResponse(record.toJSON())
        .code(201);
    })
    .catch(function(e) {
      throw Boom.wrap(e);
    });
  return reply(result);
};

BaseController.prototype.update = function(req, reply) {
  var reqData = this.data(req);
  var result = this.Model.query({
    where: {
      id: req.params.id
    }
  })
  .fetch()
  .then(function(record) {
    if (!record) { throw Boom.notFound(); }
    record.set(reqData);
    if (!record.hasChanged()) {
      throw Boom.create(404);
    }
    return record
      .save(record.changed, { patch: true, method: 'update' });
  })
  .then(function (updatedState) {
    return req.generateResponse(updatedState.toJSON()).code(201);
  });
  return reply(result);
};

BaseController.prototype.delete = function(req, reply) {
  var result = this.Model.query({
    where: {
      id: req.params.id
    }
  }).fetch()
  .then(function(record) {
    if (!record) { throw Boom.notFound(); }
    record.destroy();
    return req.generateResponse(record.toJSON())
      .code(204);
  })
  .catch(function(e) {
    return e;
  });
  return reply(result);
};

module.exports = BaseController;
