'use strict';

var prereqs = require(`../../../classes/prerequisites`);
var errors = require(`../../../classes/errors`);

var schema = require(`../schema`);
var controller = require(`../controller`);

module.exports = [{
  method: `POST`,
  path: `/projects`,
  config: {
    pre: [
      prereqs.validateCreationPermission()
    ],
    handler: controller.create.bind(controller),
    description: `Create a new project object.`,
    validate: {
      payload: schema,
      failAction: errors.attrs
    }
  }
}];
