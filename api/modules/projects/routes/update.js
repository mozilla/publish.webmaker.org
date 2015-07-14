var Joi = require('joi');

var prereqs = require('../../../classes/prerequisites');
var errors = require('../../../classes/errors');

var controller = require('../controller');
var schema = require('../schema');
var Model = require('../model');

module.exports = [{
  method: 'PUT',
  path: '/projects/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateOwnership()
    ],
    handler: controller.update.bind(controller),
    description: 'Update a single project object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.attrs
    }
  }
}];
