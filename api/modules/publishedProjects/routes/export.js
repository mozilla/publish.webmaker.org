"use strict";

const Joi = require(`joi`);

const Errors = require(`../../../classes/errors`);
const Prerequisites = require(`../../../classes/prerequisites`);

const PublishedProjectsModel = require(`../model`);
const publishedProjectsController = require(`../controller`);

module.exports = [{
  method: `POST`,
  path: `/publishedprojects/{id}/export/start`,
  config: {
    pre: [
      Prerequisites.confirmRecordExists(PublishedProjectsModel, {
        mode: `param`,
        requestKey: `id`
      }),
      Prerequisites.validateUser(),
      Prerequisites.validateOwnership()
    ],
    handler: publishedProjectsController.exportStart.bind(publishedProjectsController),
    description: `Generate a hash representing the start of an export operation for a published project.`,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
