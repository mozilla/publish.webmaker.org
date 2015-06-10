var controller = require('./controller');

exports.register = function(server, options, next) {
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
  }, {
    method: 'GET',
    path: '/projects/{project_id}/files',
    config: {
      handler: controller.getProjectFiles
    }
  }, {
    method: 'GET',
    path: '/projects/{project_id}/files/{id}',
    config: {
      handler: controller.getProjectFile
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'files'
};
