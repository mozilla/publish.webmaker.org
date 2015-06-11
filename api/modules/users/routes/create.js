var controller = require('../controller');

module.exports = [{
  method: 'POST',
  path: '/users',
  config: {
    handler: controller.createUser
  }
}];
