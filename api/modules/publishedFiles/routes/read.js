var Joi = require('joi');

var Errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'GET',
  path: '/publishedFiles/{id}',
  config: {
    auth: false,
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: 'param',
        requestKey: 'id'
      }),
    ],
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single published file object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: 'GET',
  path: '/publishedProjects/{published_id}/publishedFiles',
  config: {
    auth: false,
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: 'param',
        requestKey: 'published_id'
      }),
    ],
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of published file objects that belong to a single published project object, ' +
    'based on `published_id`.',
    validate: {
      params: {
        published_id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: 'GET',
  path: '/publishedProjects/{published_id}/publishedFiles/meta',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: 'param',
        requestKey: 'published_id',
        columns: ['id', 'published_id', 'file_id', 'path']
      }),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.getAllAsMeta.bind(controller),
    description: 'Retrieve a collection of publishedFile objects that belong to a single project object, based on 
    + `published_id`. Omits `buffer` attribute.',
    validate: {
      params: {
        project_id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
