var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/files/{id}',
  config: {
    handler: controller.deleteFile,
    description: 'Delete a single file object based on `id`.'
  }
}];
