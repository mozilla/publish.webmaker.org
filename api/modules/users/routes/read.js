var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/users',
  config: {
    handler: controller.getUsers,
    description: 'Retrieve the collection of all users.'
  }
}, {
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: controller.getUser,
    description: 'Retrieve a single user object based on `id`.'
  }
}];
