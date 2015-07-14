var Boom = require('boom');
var Promise = require('bluebird');

var errors = require('../../classes/errors');
var BaseController = require('../../classes/base_controller');
var Publisher = require('../../classes/publisher');

var Model = require('./model');
var controller = new BaseController(Model);

controller.data = function(req) {
  var data = {
    title: req.payload.title,
    user_id: req.payload.user_id,
    tags: req.payload.tags,
    description: req.payload.description,
    date_created: req.payload.date_created,
    date_updated: req.payload.date_updated
  };
  if (req.params.id) {
    data.id = parseInt(req.params.id);
  }
  return data;
};

controller.publishProject = function(req, reply) {
  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    return Publisher.publish(record)
      .then(function() {
        return req.generateResponse(record).code(200);
      });
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

controller.unpublishProject = function(req, reply) {
  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    if (!record.attributes.publish_url) { throw Boom.notFound(); }

    return Publisher.unpublish(record)
      .then(function() {
        return req.generateResponse(record).code(200);
      });
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

module.exports = controller;
