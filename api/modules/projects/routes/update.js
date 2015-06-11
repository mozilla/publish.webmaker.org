var controller = require('../controller');

module.exports = [{
  method: 'PUT',
  path: '/projects/{id}',
  config: {
    handler: controller.updateProject
  }
}];
