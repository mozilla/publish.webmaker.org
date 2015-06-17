var controller = require('../controller');

module.exports = [{
  method: 'POST',
  path: '/projects/{id}/publish',
  config: {
    handler: controller.publishProject,
    description: 'Publish a project.'
  }
}, {
  method: 'POST',
  path: '/projects/{id}/unpublish',
  config: {
    handler: controller.unpublishProject,
    description: 'Unpublish a project.'
  }
}];
