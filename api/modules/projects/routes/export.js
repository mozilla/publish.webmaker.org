"use strict";

const Joi = require(`joi`);

const Errors = require(`../../../classes/errors`);
const Prerequisites = require(`../../../classes/prerequisites`);

const ProjectsModel = require(`../model`);
const projectsController = require(`../controller`);

module.exports = [{
  method: `POST`,
  path: `/projects/{id}/export/start`,
  config: {
    pre: [
      Prerequisites.confirmRecordExists(ProjectsModel, {
        mode: `param`,
        requestKey: `id`
      }),
      Prerequisites.validateUser(),
      Prerequisites.validateOwnership(false, ProjectsModel.userForProject, true)
    ],
    handler: projectsController.exportStart.bind(projectsController),
    description: `Generate a hash representing the start of an export operation for a project.`,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: `GET`,
  path: `/projects/{id}/export/metadata`,
  config: {
    auth: `projectToken`,
    pre: [
      Prerequisites.confirmRecordExists(ProjectsModel, {
        mode: `param`,
        requestKey: `id`
      }),
      Prerequisites.validateExportPermission()
    ],
    handler: projectsController.exportProjectMetadata.bind(projectsController),
    description: `Export metadata for a project.`,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}, {
  method: `GET`,
  path: `/projects/{id}/export/data`,
  config: {
    auth: `projectToken`,
    pre: [
      Prerequisites.confirmRecordExists(ProjectsModel, {
        mode: `param`,
        requestKey: `id`
      }),
      Prerequisites.validateExportPermission()
    ],
    handler: projectsController.exportProjectData.bind(projectsController),
    description: `Export file data for a project.`,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      failAction: Errors.id
    }
  }
}];
