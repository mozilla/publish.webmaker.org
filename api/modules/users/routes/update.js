var Boom = require('boom');
var Joi = require('joi');

var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'PUT',
  path: '/users/{id}',
  config: {
    handler: controller.updateUser,
    description: 'Update a user object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('`user_id` invalid.'));
      }
    }
  }
}];
