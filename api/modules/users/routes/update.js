var Joi = require('joi');

var errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var schema = require('../schema');
var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'PUT',
  path: '/users/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.update.bind(controller),
    description: 'Update a user object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}];
