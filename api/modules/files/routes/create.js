var prereqs = require('../../../classes/prerequisites');
var errors = require('../../../classes/errors');

var schema = require('../schema');
var controller = require('../controller');
var Project = require('../../projects/model');

module.exports = [{
  method: 'POST',
  path: '/files',
  config: {
    payload: {
      allow: 'multipart/form-data',
      parse: true,
      output: 'file',
      maxBytes: 1048576 * 5 // 5mb
    },
    pre: [
      prereqs.trackTemporaryFile(),
      prereqs.validateCreationPermission('project_id', Project)
    ],
    handler: controller.create.bind(controller),
    description: 'Create a new file object.',
    validate: {
      payload: schema,
      failAction: errors.attrs
    }
  }
}];
