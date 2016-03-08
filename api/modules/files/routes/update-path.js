var Joi = require('joi');

var errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'PUT',
  path: '/files/{id}/path',
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: 'param',
        requestKey: 'id'
      }),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.updatePath.bind(controller),
    description: 'Update a file\'s path based on its `id`.',
    validate: {
      payload: Joi.object().keys({
        path: Joi.string().required()
      }),
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.attrs
    }
  }
}];
