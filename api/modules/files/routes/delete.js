var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/files/{id}',
  config: {
    handler: controller.delete.bind(controller),
    description: 'Delete a single file object based on `id`.'
  }
}];
