var Boom = require('boom');
var Joi = require('joi');
var controller = require('../controller');

module.exports = [{
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    handler: controller.deleteUser,
    description: 'Delete a user object based on `id`.',
    validate: { 
      params: {
        id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('`user_id` invalid.'));
      }
    }
  }
}];
