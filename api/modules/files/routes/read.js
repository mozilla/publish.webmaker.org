var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/files',
  config: {
    handler: controller.getFiles,
    description: 'Retrieve a collection of file objects.'
  }
}, {
  method: 'GET',
  path: '/files/{id}',
  config: {
    handler: controller.getFile,
    description: 'Retrieve a single file object based on `id`.'
  }
}, {
  method: 'GET',
  path: '/projects/{project_id}/files',
  config: {
    handler: controller.getProjectFiles,
    description: 'Retrieve a collection of file objects that belong to a single project object, based on `project_id`.'
  }
}, {
  method: 'GET',
  path: '/projects/{project_id}/files/{id}',
  config: {
    handler: controller.getProjectFile,
    description: 'Retrieve a single file object that belongs to a single project object, based on `project_id`.'
  }
}];
