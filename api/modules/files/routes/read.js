var controller = require('../controller');

module.exports = [{
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
}];
