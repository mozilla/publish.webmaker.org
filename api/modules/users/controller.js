'use strict';

var Boom = require(`boom`);
var Promise = require(`bluebird`); // jshint ignore:line

var Model = require(`./model`);
var errors = require(`../../classes/errors`);

var BaseController = require(`../../classes/base_controller`);
var controller = new BaseController(Model);

controller.formatRequestData = function(req) {
  var data = {
    name: req.payload.name
  };

  if (req.params.id) {
    data.id = parseInt(req.params.id, 10);
  }
  return data;
};

controller.login = function(req, reply) {
  var self = this;

  var result = Promise.resolve().then(() => {
    // First, check if the auth matches the requested user
    if (req.payload.name !== req.auth.credentials.username) {
      throw Boom.unauthorized(null, {
        debug: true,
        error: `Authenticated user doesn't match the user requested`
      });
    }

    return self.Model.query({
      where: {
        name: req.payload.name
      }
    }).fetch();
  })
  .then(record => {
    if (!record) {
      return self.Model.forge({
        name: req.payload.name
      })
      .save()
      .then(newRecord => req.generateResponse(newRecord.toJSON()).code(201));
    }
    return req.generateResponse(record.toJSON())
      .code(200);
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

module.exports = controller;
