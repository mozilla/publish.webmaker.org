const controller = require('./controller');

exports.register = function(server, options, next){

  server.route([{
    method: 'GET',
    path: '/files',
    config: {
      handler: controller.getFiles
    }
  }, {
    method: 'GET',
    path: '/files/{id}',
    config: {
      handler: controller.getFile
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'files'
};
