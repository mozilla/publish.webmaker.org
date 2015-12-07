var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var model = require('../model');

module.exports = [{
  path: '/publishedProjects/{id}/remix',
  method: 'PUT',
  config: {
    pre: [
      prereqs.confirmRecordExists(model, {
        mode: 'param',
        requestKey: 'id'
      }),
      prereqs.validateUser()
    ],
    handler: controller.remix.bind(controller),
    description: 'Create a new project object.'
  }
}];
