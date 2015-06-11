var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'PUT',
  path: '/projects/{id}',
  config: {
    handler: controller.updateProject,
    description: 'Update a single project object based on `id`.',
    validate: {
      payload: schema
    }
  }
}];
