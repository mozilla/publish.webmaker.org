var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/users',
  config: {
    handler: controller.getUsers
  }
}, {
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: controller.getUser
  }
}];
