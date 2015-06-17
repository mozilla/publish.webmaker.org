var Model = require('./model');
var Project = require('../projects/model');
var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.payload = function(payload){
  return { 
    title: payload.title,
    user_id: req.payload.user_id,
    tags: req.payload.tags,
    description: req.payload.description,
    date_created: req.payload.date_created,
    date_updated: req.payload.date_updated
  };
};

controller.getUserProjects = function(req, reply) {
  return reply(Project.query({
    where: {
      user_id: req.params.user_id
    }
  }).fetchAll());
};

controller.getUserProject = function(req, reply) {
  return reply(Project.query({
    where: {
      user_id: req.params.user_id,
      id: req.params.id
    }
  }).fetch());
};

module.exports = controller;
