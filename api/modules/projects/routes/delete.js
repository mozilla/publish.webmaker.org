var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/projects/{id}',
  config: {
    handler: controller.deleteProject
  }
}];
