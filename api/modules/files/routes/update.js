var controller = require('../controller');

module.exports = [{
  method: 'PUT',
  path: '/files/{id}',
  config: {
    handler: controller.updateFile
  }
}];
