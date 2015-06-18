var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'PUT',
  path: '/files/{id}',
  config: {
    handler: controller.update.bind(controller),
    description: 'Update a single file object based on `id`.',
    validate: {
      payload: schema
    }
  }
}];
