var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/projects/{id}',
  config: {
    handler: controller.delete.bind(controller),
    description: 'Delete a single project object based on `id`.'
  }
}];
