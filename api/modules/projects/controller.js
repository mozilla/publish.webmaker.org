var Boom = require('boom');
var Promise = require('bluebird'); // jshint ignore:line

var errors = require('../../classes/errors');
var BaseController = require('../../classes/base_controller');
var Publisher = require('../../classes/publisher');

var Files = require('../files/model');
var PublishedFiles = require('../publishedFiles/model');

var Model = require('./model');
var controller = new BaseController(Model);

var dateTracker = require('../../../lib/utils').dateTracker;

controller.formatRequestData = function(req) {
  var now = new Date();
  var data = {
    title: req.payload.title,
    user_id: req.payload.user_id,
    tags: req.payload.tags,
    description: req.payload.description,
    date_created: now,
    date_updated: now,
    readonly: req.payload.readonly,
    client: req.payload.client
  };

  // If it is an update request
  if (req.params.id) {
    data.id = parseInt(req.params.id);
    delete data.date_created;
  }

  return data;
};

controller.formatResponseData = dateTracker.convertToISOStrings();

controller.create = function(req, reply) {
  return BaseController.prototype.create.call(this, req, reply, dateTracker.convertToISOStrings(true));
};

controller.update = function(req, reply) {
  return BaseController.prototype.update.call(this, req, reply, dateTracker.convertToISOStrings(true));
};

controller.publishProject = function(req, reply) {
  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    return Publisher.publish(record)
    .then(dateTracker.convertToISOStrings(true))
    .then(function(publishedRecord) {
      return req.generateResponse(publishedRecord).code(200);
    });
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

controller.unpublishProject = function(req, reply) {
  var result = Promise.resolve().then(function() {
    var record = req.pre.records.models[0];

    if (!record.attributes.publish_url) {
      throw Boom.notFound(null, {
        debug: true,
        error: 'This project was not published'
      });
    }

    return Publisher.unpublish(record)
    .then(dateTracker.convertToISOStrings(true))
    .then(function(unpublishedRecord) {
      return req.generateResponse(unpublishedRecord).code(200);
    });
  })
  .catch(errors.generateErrorResponse);

  return reply(result);
};

controller.delete = function(req, reply) {
  var self = this;
  var project = req.pre.records.models[0];

  function clearAllPublishedFiles() {
    function fetchFiles() {
      return Files.query({
        where: {
          project_id: project.get('id')
        }
      }).fetchAll();
    }

    function fetchPublishedFiles(file) {
      return PublishedFiles.query({
        where: {
          file_id: file.get('id')
        }
      }).fetchAll();
    }

    function clearPublishedFiles(publishedFiles) {
      if (publishedFiles.length === 0) {
        return;
      }
      return publishedFiles.mapThen(function(publishedFile) {
        return publishedFile.destroy();
      });
    }

    return Promise.resolve()
      .then(fetchFiles)
      .then(function(files) {
        return files.mapThen(function(file) {
          return fetchPublishedFiles(file)
            .then(clearPublishedFiles);
        });
      });
  }

  // If this project is published, we have to
  // unpublish it before it can be safely deleted.
  // We then do a dummy check to make sure no old publishedFiles
  // exist for this. Horribly inefficent!
  // TODO: https://github.com/mozilla/publish.webmaker.org/issues/140
  Promise.resolve().then(function() {
    if (project.get('published_id')) {
      return Publisher.unpublish(project);
    }
  })
  .then(clearAllPublishedFiles)
  .then(function() {
    BaseController.prototype.delete.call(self, req, reply);
  })
  .catch(function(e) {
    reply(errors.generateErrorResponse(e));
  });
};

module.exports = controller;
