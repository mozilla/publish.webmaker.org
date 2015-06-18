var controller = require('../controller');
var schema = require('../schema');
var Joi = require('joi');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'PUT',
  path: '/files/{id}',
  config: {
    handler: controller.update.bind(controller),
    description: 'Update a single file object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
