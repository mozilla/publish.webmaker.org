var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'POST',
  path: '/users',
  config: {
    handler: controller.createUser,
    description: 'Create a new user object.',
    validate: {
      payload: schema
    }
  }
}];
