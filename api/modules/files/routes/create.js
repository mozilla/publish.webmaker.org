var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'POST',
  path: '/files',
  config: {
    handler: controller.createFile,
    description: 'Create a new file object.',
    validate: {
      payload: schema
    }
  }
}];
