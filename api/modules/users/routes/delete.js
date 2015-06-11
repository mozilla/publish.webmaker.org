var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    handler: controller.deleteUser,
    description: 'Delete a user object based on `id`.'
  }
}];
