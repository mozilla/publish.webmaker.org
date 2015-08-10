var prereqs = require('../../../classes/prerequisites');
var errors = require('../../../classes/errors');

var schema = require('../schema');
var controller = require('../controller');
var model = require('../model');

module.exports = [{
  path: '/publishedProjects/{id}/remix',
  method: 'PUT',
  config: {
    pre: [
      prereqs.confirmRecordExists(model, 'param', 'id'),
      prereqs.validateUser()
    ],
    handler: controller.remix.bind(controller),
    description: 'Create a new project object.',
    validate: {
      query: schema,
      failAction: errors.attrs
    }
  }
}];
