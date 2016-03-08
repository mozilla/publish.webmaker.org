'use strict';

var Joi = require(`joi`);

var errors = require(`../../../classes/errors`);
var prereq = require(`../../../classes/prerequisites`);

var controller = require(`../controller`);
var Model = require(`../model`);

module.exports = [{
  method: `DELETE`,
  path: `/files/{id}`,
  config: {
    pre: [
      prereq.confirmRecordExists(Model, {
        mode: `param`,
        requestKey: `id`
      }),
      prereq.validateUser(),
      prereq.validateOwnership()
    ],
    handler: controller.delete.bind(controller),
    description: `Delete a single file object based on \`id\`.`,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: errors.id
    }
  }
}];
