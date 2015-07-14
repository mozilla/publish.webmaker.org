var Boom = require('boom');
var Promise = require('bluebird');

var Model = require('./model');
var errors = require('../../classes/errors');

var BaseController = require('../../classes/base_controller');
var controller = new BaseController(Model);

controller.data = function(req) {
  var data = {
    name: req.payload.name
  };
  if (req.params.id) {
    data.id = parseInt(req.params.id);
  }
  return data;
};

controller.login = function(req, reply) {
  var self = this;

  var result = Promise.resolve().then(function() {
    // First, check if the auth matches the requested user
    if (req.payload.name !== req.auth.credentials.username) {
      throw Boom.unauthorized();
    }

    return self.Model.query({
      where: {
        name: req.payload.name
      }
    }).fetch();
  })
  .then(function(record) {
    if (!record) {
      return self.Model.forge({
        name: req.payload.name
      })
      .save()
      .then(function(newRecord) {
        return req.generateResponse(newRecord.toJSON())
          .code(201);
      });
    }
    return req.generateResponse(record.toJSON())
      .code(200);
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

module.exports = controller;
