var Boom = require('boom');

var Errors = require('../../classes/errors');
var BaseController = require('../../classes/base_controller');

var Project = require('../projects/model');
var File = require('../files/model');
var PublishedFiles = require('../publishedFiles/model');

var Model = require('./model');

var controller = new BaseController(Model);

function copyFile(file, projectId) {
  return File.forge({
    path: file.get('path'),
    project_id: projectId,
    buffer: file.get('buffer')
  }).save();
}

controller.clone = function(req, reply) {
  var user = req.pre.user;
  var publishedProject = req.pre.records.models[0];
  var now = (new Date()).toISOString();
  var project;

  var result = Project.forge({
    title: publishedProject.get('title'),
    user_id: user.get('id'),
    tags: publishedProject.get('tags'),
    description: publishedProject.get('description'),
    date_created: now,
    date_updated: now
  }).save()
  .then(function(p) {
    project = p;
    return PublishedFiles.query({
      where: {
        published_id: publishedProject.get('id')
      }
    }).fetchAll();
  })
  .then(function(files) {
    if (!files.length) { throw Boom.badImplementation(); }

    return files.mapThen(function(file) {
      return copyFile(file, project.get('id'));
    });
  })
  .then(function() {
    return req.generateResponse(project.toJSON())
      .code(201);
  })
  .catch(Errors.generateErrorResponse);

  return reply(result);
};

module.exports = controller;
