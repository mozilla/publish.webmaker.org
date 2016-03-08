'use strict';

var controller = require(`../controller`);
var prereqs = require(`../../../classes/prerequisites`);

var Model = require(`../model`);

module.exports = [{
  method: `PUT`,
  path: `/projects/{id}/publish`,
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: `param`,
        requestKey: `id`
      }),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.publishProject.bind(controller),
    description: `Publish a project.`
  }
}, {
  method: `PUT`,
  path: `/projects/{id}/unpublish`,
  config: {
    pre: [
      prereqs.confirmRecordExists(Model, {
        mode: `param`,
        requestKey: `id`
      }),
      prereqs.validateUser(),
      prereqs.validateOwnership()
    ],
    handler: controller.unpublishProject.bind(controller),
    description: `Unpublish a project.`
  }
}];
