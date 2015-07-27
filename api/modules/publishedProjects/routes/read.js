var Joi = require('joi');

var Errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'GET',
  path: '/publishedProjects/{id}',
  config: {
    auth: false,
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id')
    ],
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single published project object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: 'GET',
  path: '/publishedProjects',
  config: {
    auth: false,
    pre: [
      prereqs.confirmRecordExists(Model)
    ],
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of published project objects.'
  }
}];
