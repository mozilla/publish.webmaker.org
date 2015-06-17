var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/projects',
  config: {
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of project objects.'
  }
}, {
  method: 'GET',
  path: '/projects/{id}',
  config: {
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single project object based on `id`.'
  }
}, {
  method: 'GET',
  path: '/users/{user_id}/projects',
  config: {
    handler: controller.getUserProjects,
    description: 'Retrieve a collection of project objects belonging to a single user object, based on `user_id`.'
  }
}, {
  method: 'GET',
   path: '/users/{user_id}/projects/{id}',
  config: {
    handler: controller.getUserProject,
    description: 'Retrieve a sinle project object based on `id` belonging to a single user object, based on `user_id`.'
  }
}];
