var controller = require('../controller');
var query = require('../query');

module.exports = [{
  method: 'GET',
  path: '/users',
  config: {
    handler: controller.getAll.bind(controller),
    description: 'Retrieve the collection of all users.',
    validate: {
      query: query
    }
  }
}, {
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single user object based on `id`.'
  }
}];
