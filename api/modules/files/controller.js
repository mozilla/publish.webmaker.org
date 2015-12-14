var fs = require('fs');

var BaseController = require('../../classes/base_controller');
var errors = require('../../classes/errors');

var Model = require('./model');
var controller = new BaseController(Model);

var PublishedFiles = require('../publishedFiles/model');

// We do not want to serialize the buffer and send it with the
// response for Create and Update requests so we strip it out
// of the response before it is sent.
function formatResponse(model) {
  model.unset('buffer');
  return model;
}

controller.formatRequestData = function(req) {
  // We've already cached the path of the temporary file
  // in a prerequisite function
  var buffer = fs.readFileSync(req.pre.tmpFile);

  var data =  {
    path: req.payload.path,
    project_id: req.payload.project_id,
    buffer: buffer
  };
  if (req.params.id) {
    data.id = parseInt(req.params.id);
  }
  return data;
};

controller.create = function(req, reply) {
  return BaseController.prototype.create.call(this, req, reply, formatResponse);
};

controller.update = function(req, reply) {
  return BaseController.prototype.update.call(this, req, reply, formatResponse);
};

controller.delete = function(req, reply) {
  var self = this;
  var record = req.pre.records.models[0];

  // If a published file exists for this file, we have
  // to unset it's reference before deletion can occur
  PublishedFiles.query({
    where: {
      file_id: record.get('id')
    }
  }).fetch()
  .then(function(model) {
    if (!model) {
      return;
    }
    return model.set({
      file_id: null
    }).save();
  })
  .then(function() {
    BaseController.prototype.delete.call(self, req, reply);
  })
  .catch(function(e) {
    reply(errors.generateErrorResponse(e));
  });
};

module.exports = controller;
