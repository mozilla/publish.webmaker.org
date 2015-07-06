var controller = require('../controller');

module.exports = [{
  method: 'PUT',
  path: '/projects/{id}/publish',
  config: {
    handler: controller.publishProject,
    description: 'Publish a project.'
  }
}, {
  method: 'PUT',
  path: '/projects/{id}/unpublish',
  config: {
    handler: controller.unpublishProject,
    description: 'Unpublish a project.'
  }
}];
