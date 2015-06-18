var Model = require('./model');
var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.data = function(req) {
  var data = {
    name: req.payload.name
  };
  if (req.params.id) {
    data.id = parseInt(req.params.id);
  }
  return data;
};

module.exports = controller;
