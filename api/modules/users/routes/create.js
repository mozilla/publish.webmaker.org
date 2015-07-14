var controller = require('../controller');
var schema = require('../schema');
var errors = require('../../../classes/errors');

module.exports = [{
  method: 'POST',
  path: '/users',
  config: {
    handler: controller.login.bind(controller),
    description: 'Create a new user object.',
    validate: {
      payload: schema,
      failAction: errors.attrs
    }
  }
}];
