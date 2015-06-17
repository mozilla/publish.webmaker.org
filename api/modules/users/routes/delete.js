var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    handler: controller.delete.bind(controller),
    description: 'Delete a user object based on `id`.'
  }
}];
