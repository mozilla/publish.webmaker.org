var BaseController = require('../../classes/base_controller');

var Model = require('./model');
var controller = new BaseController(Model);

controller.data = function(req) {
  var data =  {
    path: req.payload.path,
    project_id: req.payload.project_id,
    buffer: new Buffer(req.payload.buffer)
  };
  if (req.params.id) {
    data.id = parseInt(req.params.id);
  }
  return data;
};

module.exports = controller;
