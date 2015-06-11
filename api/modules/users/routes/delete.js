var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    handler: controller.deleteUser
  }
}];
