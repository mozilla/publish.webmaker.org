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
  }, {
    method: 'POST',
    path: '/files',
    config: {
      handler: controller.createFile
    }
  }, {
    method: 'PUT',
    path: '/files/{id}',
    config: {
      handler: controller.updateFile
    }
  }, {
    method: 'DELETE',
    path: '/files/{id}',
    config: {
      handler: controller.deleteFile
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'files'
};
