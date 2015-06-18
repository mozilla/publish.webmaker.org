var Model = require('./model');
var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.payload = function(payload) {
  return {
    name: payload.name
  };
};

module.exports = controller;
