var controller = require('./controller');

exports.register = function(server, options, next) {
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
  }, {
    method: 'GET',
    path: '/users/{user_id}/projects',
    config: {
      handler: controller.getUserProjects
    }
  }, {
    method: 'GET',
    path: '/users/{user_id}/projects/{id}',
    config: {
      handler: controller.getUserProject
    }
  }, {
    method: 'POST',
    path: '/projects',
    config: {
      handler: controller.createProject
    }
  }, {
    method: 'PUT',
    path: '/projects/{id}',
    config: {
      handler: controller.updateProject
    }
  }, {
    method: 'DELETE',
    path: '/projects/{id}',
    config: {
      handler: controller.deleteProject
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'projects'
};
