var Boom = require('boom');
var Joi = require('joi');
var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/projects',
  config: {
    handler: controller.getProjects,
    description: 'Retrieve a collection of project objects.'
  }
}, {
  method: 'GET',
  path: '/projects/{id}',
  config: {
    handler: controller.getProject,
    description: 'Retrieve a single project object based on `id`.',
    validate: {
      params: {
        project_id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('Project id is invalid'));
      }
    }
  }
}, {
  method: 'GET',
  path: '/users/{user_id}/projects',
  config: {
    handler: controller.getUserProjects,
    description: 'Retrieve a collection of project objects belonging to a single user object, based on `user_id`.',
    validate: {
      params: {
        user_id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('User id is invalid.'));
      }
    }
  }
}, {
  method: 'GET',
   path: '/users/{user_id}/projects/{id}',
  config: {
    handler: controller.getUserProject,
    description: 'Retrieve a sinle project object based on `id` belonging to a single user object, based on `user_id`.',
    validate: {
      params: {
        id: Joi.number().required(),
        user_id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('`user_id` and/or `id` is invalid'));
      }
    }
  }
}];
