var controller = require('../controller');
var Joi = require('joi');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'DELETE',
  path: '/projects/{id}',
  config: {
    handler: controller.delete.bind(controller),
    description: 'Delete a single project object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
