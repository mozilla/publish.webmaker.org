var Promise = require('bluebird'); // jshint ignore:line

var errors = require('../../classes/errors');
var BaseController = require('../../classes/base_controller');

var controller = new BaseController(require('./model'));

var Projects = require('../projects/model');
var Files = require('../files/model');
var PublishedFiles = require('../publishedFiles/model');

// Make sure we have the ' (remix)' suffix, adding if necessary,
// but not re-adding to a title that already has it (remix of remix).
function ensureRemixSuffix(title) {
  return title.replace(/( \(remix\))*$/, ' (remix)');
}

// Taken from http://stackoverflow.com/a/643827
function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]';
}

function formatResponse(model) {
  var created = model.get('date_created');
  var updated = model.get('date_updated');

  if (isDate(created)) {
    model.set('date_created', created.toISOString());
  }
  if (isDate(updated)) {
    model.set('date_updated', updated.toISOString());
  }

  return model;
}

controller.formatResponseData = function(data) {
  if (isDate(data.date_created)) {
    data.date_created = data.date_created.toISOString();
  }
  if (isDate(data.date_updated)) {
    data.date_updated = data.date_updated.toISOString();
  }

  return data;
};

controller.create = function(req, reply) {
  return BaseController.prototype.create.call(this, req, reply, formatResponse);
};

controller.update = function(req, reply) {
  return BaseController.prototype.update.call(this, req, reply, formatResponse);
};

controller.remix = function(req, reply) {
  var publishedProject = req.pre.records.models[0];
  var user = req.pre.user;

  function copyFiles(newProject) {
    function getPublishedFiles() {
      return PublishedFiles.query({
        where: {
          published_id: publishedProject.get('id')
        }
      }).fetchAll();
    }

    function duplicateFiles(publishedFiles) {
      return Promise.map(publishedFiles.models, function(publishedFile) {
        return Files.forge({
          path: publishedFile.get('path'),
          project_id: newProject.get('id'),
          buffer: publishedFile.get('buffer')
        }).save();
      });
    }

    return getPublishedFiles()
      .then(duplicateFiles)
      .then(function() {
        return newProject;
      });
  }

  function duplicateProject() {
    return Projects.forge({
      title: ensureRemixSuffix(publishedProject.get('title')),
      user_id: user.get('id'),
      tags: publishedProject.get('tags'),
      description: publishedProject.description,
      date_created: req.query.now,
      date_updated: req.query.now
    }).save()
    .then(copyFiles)
    .then(formatResponse)
    .catch(errors.generateErrorResponse);
  }

  return reply(duplicateProject());
};

module.exports = controller;
