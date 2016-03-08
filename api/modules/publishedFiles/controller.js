'use strict';

var BaseController = require(`../../classes/base_controller`);

var Model = require(`./model`);

var controller = new BaseController(Model);

controller.formatResponseData = function(publishedFile) {
  delete publishedFile.file_id;
  return publishedFile;
};

module.exports = controller;
