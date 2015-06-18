var Model = require('./model');
var BaseController = require('../../classes/base_controller');

var controller = new BaseController(Model);

controller.data = function(req) {
  var data = {
    name: req.payload.name
  };
  if (req.params.id) {
    data.id = req.params.id;
  }
  return data;
};

controller.login = function(req, reply) {
  var result = Model.query({
    where: {
      name: req.payload.name
    }
  }).fetch()
  .then(function(record){
    if(!record){
      Model.forge({
        name: req.payload.name
      })
      .save()
      .then(function(newRecord){
        return req.generateResponse(newRecord.toJSON())
          .code(201);
      });
    } else {
      return req.generateResponse(record.toJSON())
        .code(200);
    }
  });
  console.log(result);
  return reply(result);
};

module.exports = controller;
