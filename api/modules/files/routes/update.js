var Joi = require('joi');

var Errors = require('../../../classes/errors');
var prereqs = require('../../../classes/prerequisites');

var schema = require('../schema');
var controller = require('../controller');
var Model = require('../model');

module.exports = [{
  method: 'PUT',
  path: '/files/{id}',
  config: {
    payload: {
      allow: 'multipart/form-data',
      parse: true,
      output: 'file',
      maxBytes: process.env.FILE_SIZE_LIMIT || 1048576 * 5 // 5mb
    },
    pre: [
      prereqs.trackTemporaryFile(),
      prereqs.confirmRecordExists(Model, {
        mode: 'param',
        requestKey: 'id'
      }),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.update.bind(controller),
    description: 'Update a single file object based on `id`.',
    validate: {
      payload: schema,
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
