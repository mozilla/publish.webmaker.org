var controller = require('../controller');

module.exports = [{
  method: 'PUT',
  path: '/users/{id}',
  config: {
    handler: controller.updateUser
  }
}];
