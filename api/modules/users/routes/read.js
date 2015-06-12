var controller = require('../controller');
var query = require('../query');

module.exports = [{
  method: 'GET',
  path: '/users',
  config: {
    handler: controller.getUsers,
    description: 'Retrieve the collection of all users.',
    validate: {
      query: query
    }
  }
}, {
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: controller.getUser,
    description: 'Retrieve a single user object based on `id`.'
  }
}];
