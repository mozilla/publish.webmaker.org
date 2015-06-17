var controller = require('../controller');
var schema = require('../schema');
var errors = require('../../../classes/errors');

module.exports = [{
  method: 'POST',
  path: '/projects',
  config: {
    handler: controller.create.bind(controller),
    description: 'Create a new project object.',
    validate: {
      payload: schema,
      failAction: errors.attrs
    }
  }
}];
