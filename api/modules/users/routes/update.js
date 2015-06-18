var controller = require('../controller');
var schema = require('../schema');
var Joi = require('joi');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'PUT',
  path: '/users/{id}',
  config: {
    handler: controller.update.bind(controller),
    description: 'Update a user object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
