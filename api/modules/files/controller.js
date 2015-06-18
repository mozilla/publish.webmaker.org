var Boom = require('boom');
var Model = require('./model');

var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.payload = function(payload) {
  return {
    path: payload.path,
    project_id: payload.project_id,
    buffer: payload.buffer
  };
};

controller.getProjectFiles = function(req, reply) {
  var result =  Model.query({
    where: {
      project_id: req.params.project_id
    }
  }).fetchAll()
  .then(function(records) {
    if (!records) { throw Boom.notFound(); }
    return req.generateResponse(records.toJSON())
      .code(200);
  });
  return reply(result);
};

controller.getProjectFile = function(req, reply) {
  var result = Model.query({
    where: {
      project_id: req.params.project_id,
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

module.exports = controller;
