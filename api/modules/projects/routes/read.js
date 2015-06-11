var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/projects',
  config: {
    handler: controller.getProjects
  }
}, {
  method: 'GET',
  path: '/projects/{id}',
  config: {
    handler: controller.getProject
  }
}, {
  method: 'GET',
  path: '/users/{user_id}/projects',
  config: {
    handler: controller.getUserProjects
  }
}, {
  method: 'GET',
   path: '/users/{user_id}/projects/{id}',
  config: {
    handler: controller.getUserProject
  }
}];
