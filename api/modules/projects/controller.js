var Boom = require('boom');
var Model = require('./model');
var BaseController = require('../../classes/base_controller');
var Publisher = require('../../classes/publisher');
var controller = new BaseController(Model);
var logger = require('../../../logger');

function generateErrorResponse(e) {
  if (e.isBoom) {
    logger.error(e);
    return e;
  }

  return Boom.badImplementation(e);
}

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

controller.getUserProjects = function(req, reply) {
  var result = Model.query({
    where: {
      user_id: req.params.user_id
    }
  }).fetchAll()
  .then(function(records) {
    if (!records) { throw Boom.notFound(); }
    return req.generateResponse(records.toJSON())
      .code(200);
  });

  return reply(result);
};

controller.getUserProject = function(req, reply) {
  var result = Model.query({
    where: {
      user_id: req.params.user_id,
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

controller.publishProject = function(req, reply) {
  var result = Model.query({
    where: {
      id: req.params.id
    }
  }).fetch()
  .then(function(record) {
    if (!record) { throw Boom.notFound(); }

    return Publisher.publish(record)
      .then(function() {
        return req.generateResponse(record).code(200);
      });
  })
  .catch(generateErrorResponse);

  return reply(result);
};

controller.unpublishProject = function(req, reply) {
  var result = Model.query({
    where: {
      id: req.params.id
    }
  }).fetch()
  .then(function(record) {
    if (!record) { throw Boom.notFound(); }
    if (!record.attributes.publish_url) { throw Boom.notFound(); }

    return Publisher.unpublish(record)
      .then(function() {
        return req.generateResponse(record).code(200);
      });
  })
  .catch(generateErrorResponse);

  return reply(result);
};

module.exports = controller;
