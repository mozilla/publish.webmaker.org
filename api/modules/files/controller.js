var Boom = require('boom');
var Promise = require('bluebird');

var Model = require('./model');
var Project = require('../projects/model');

var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.payload = function(payload) {
  return {
    path: payload.path,
    project_id: payload.project_id,
    buffer: payload.buffer
  };
}

controller.getProjectFiles = function(req, reply) {
    Project.query({
      where: {
        id: req.params.project_id
      }
    }).fetch()
    .then(function(record) {
      if (!record) {
        return Promise.reject('Project reference does not exist.');
      }

      return Model.query({
        where: {
          project_id: req.params.project_id
        }
      }).fetchAll();
    })
    .then(function(records) {
      if(records.models.length < 1) {
        return reply(Boom.notFound());
      }

      reply(records.toJSON());
    })
    .catch(function(e) {
      reply(Boom.badRequest(e));
    });
  };

controller.getProjectFile = function(req, reply) {
    Project.query({
      where: {
        id: req.params.project_id
      }
    }).fetch()
    .then(function(record) {
      if (!record) {
        return Promise.reject('Project reference does not exist.');
      }

      return Model.query({
        where: {
          project_id: req.params.project_id,
          id: req.params.id
        }
      }).fetch();
    })
    .then(function(record) {
      if (!record || !record.id) {
        return reply(Boom.notFound());
      }

      reply(record.toJSON());
    })
    .catch(function(e) {
      reply(Boom.badRequest(e));
    });
  }

module.exports = controller;
