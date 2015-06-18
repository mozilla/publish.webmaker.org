var Joi = require('joi');
var controller = require('../controller');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'GET',
  path: '/files',
  config: {
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of file objects.'
  }
}, {
  method: 'GET',
  path: '/files/{id}',
  config: {
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single file object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
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
        project_id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: 'GET',
  path: '/projects/{project_id}/files/{id}',
  config: {
    handler: controller.getProjectFile,
    description: 'Retrieve a single file object that belongs to a single project object, based on `project_id`.',
    validate: {
      params: {
        project_id: Joi.number().integer().required(),
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
