var Joi = require('joi');

var Errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'GET',
  path: '/files/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateOwnership()
    ],
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single file object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: 'GET',
  path: '/projects/{project_id}/files',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'project_id'),
      prereqs.validateOwnership()
    ],
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of file objects that belong to a single project object, based on `project_id`.',
    validate: {
      params: {
        project_id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
