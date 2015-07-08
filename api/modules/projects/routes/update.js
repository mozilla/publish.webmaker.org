var controller = require('../controller');
var schema = require('../schema');
var Joi = require('joi');
var errors = require('../../../classes/errors');

module.exports = [{
  method: 'PUT',
  path: '/projects/{id}',
  config: {
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
