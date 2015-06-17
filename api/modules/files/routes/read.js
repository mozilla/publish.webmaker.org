var Boom = require('boom');
var Joi = require('joi');
var controller = require('../controller');

module.exports = [{
  method: 'GET',
  path: '/files',
  config: {
    handler: controller.getFiles,
    description: 'Retrieve a collection of file objects.'
  }
}, {
  method: 'GET',
  path: '/files/{id}',
  config: {
    handler: controller.getFile,
    description: 'Retrieve a single file object based on `id`.',
    validate: {
      params: {
        id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('`file_id` is invalid'));
      }
    }
  }
}, {
  method: 'GET',
  path: '/projects/{project_id}/files',
  config: {
    handler: controller.getProjectFiles,
    description: 'Retrieve a collection of file objects that belong to a single project object, based on `project_id`.',
    validate: {
      params: {
        project_id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        reply(Boom.badRequest('`project_id` is invalid'));
      }
    }
  },
}, {
  method: 'GET',
  path: '/projects/{project_id}/files/{id}',
  config: {
    handler: controller.getProjectFile,
    description: 'Retrieve a single file object that belongs to a single project object, based on `project_id`.',
    validate: {
      params: {
        project_id: Joi.number().required(),
        id: Joi.number().required()
      },
      failAction: function(request, reply, source, error) {
        if (error.message.indexOf('"id" must be a number') !== -1) {
          return reply(Boom.badRequest('`file_id` is invalid'));
        }

        reply(Boom.badRequest('`project_id` is invalid'));
      }
    }
  }
}];
