var Joi = require('joi');

var prereqs = require('../../../classes/prerequisites');
var errors = require('../../../classes/errors');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'DELETE',
  path: '/projects/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateOwnership()
    ],
    handler: controller.delete.bind(controller),
    description: 'Delete a single project object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}];
