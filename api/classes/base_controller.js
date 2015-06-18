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
    });
  return reply(result);
};

BaseController.prototype.update = function(req, reply) {
  var current_state = this.Model.query({
    where: {
      id: req.params.id
    }
  }).fetch().then(function(record){
    if (!record) { throw Boom.notFound(); }
    return record.toJSON();
  });
  this.Model.query({
    where: {
      id: req.params.id
    }
  })
  .save(this.data(req), {
    method: 'update',
    patch: 'true'
  });
  var updated_state = this.Model.query({
    where: {
      id: req.params.id
    }
  }).fetch().then(function(record){
    if (!record) { throw Boom.notFound(); }    
    return record.toJSON();
  });
  if (updated_state === current_state) {
    throw Boom.create(500, 'Update failed.');  
  } else {
    var result = req.generateResponse(updated_state)
      .code(201);
  }
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
  });
  return reply(result);
};

module.exports = BaseController;
