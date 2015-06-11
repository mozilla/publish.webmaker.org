var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'PUT',
  path: '/users/{id}',
  config: {
    handler: controller.updateUser,
    description: 'Update a user object based on `id`.',
    validate: {
      payload: schema
    }
  }
}];
