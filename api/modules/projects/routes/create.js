var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'POST',
  path: '/projects',
  config: {
    handler: controller.createProject,
    description: 'Create a new project object.',
    validate: {
      payload: schema
    }
  }
}];
