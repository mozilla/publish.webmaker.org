const controller = require('./controller');

exports.register = function(server, options, next){

  server.route([{
    method: 'GET',
    path: '/projects',
    config: {
      handler: controller.getProjects
    }
  }, {
    method: 'GET',
    path: '/projects/{id}',
    config: {
      handler: controller.getProject
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'projects'
};
