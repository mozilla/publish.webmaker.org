var Joi = require('joi');

var errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');
var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'PUT',
  path: '/remix/{id}',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, 'param', 'id'),
      prereqs.validateUser()
    ],
    handler: controller.clone.bind(controller),
    description: 'Copy a published project with the given `id` and its files into the current user\'s projects and files respectively',
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}];
