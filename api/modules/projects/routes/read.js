var Joi = require('joi');

var errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'GET',
  path: '/projects/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateOwnership()
    ],
    handler: controller.getOne.bind(controller),
    description: 'Retrieve a single project object based on `id`.',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}, {
  method: 'GET',
  path: '/users/{user_id}/projects',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'user_id'),
      prereqs.validateOwnership()
    ],
    handler: controller.getAll.bind(controller),
    description: 'Retrieve a collection of project objects belonging to a single user object, based on `user_id`.',
    validate: {
      params: {
        user_id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}];
