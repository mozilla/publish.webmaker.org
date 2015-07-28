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
      prereqs.confirmRecordExists(Model, 'param', 'id')
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
      prereqs.confirmRecordExists(Model, 'param', 'published_id')
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
}];
