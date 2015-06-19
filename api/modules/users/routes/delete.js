var controller = require('../controller');
var Joi = require('joi');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    handler: controller.delete.bind(controller),
    description: 'Delete a user object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
