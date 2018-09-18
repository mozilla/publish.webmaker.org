"use strict";

const Promise = require(`bluebird`); // jshint ignore:line

const BaseController = require(`../../classes/base_controller`);
const Errors = require(`../../classes/errors`);

const ProjectsModel = require(`../projects/model`);
const FilesModel = require(`../files/model`);
const PublishedFilesModel = require(`../publishedFiles/model`);

const PublishedProjectsModel = require(`./model`);

const DateTracker = require(`../../../lib/utils`).DateTracker;

class Remix {
  constructor(publishedProjectModel, user, server) {
    this.publishedProjectsModel = publishedProjectModel;
    this.user = user;
    this.server = server;
  }

  // Make sure we have the ` (remix)` suffix, adding if necessary,
  // but not re-adding to a title that already has it (remix of remix).
  ensureRemixSuffix(title) {
    return title.replace(/( \(remix\))*$/, ` (remix)`);
  }

  _createProjectRemix() {
    const now = (new Date()).toISOString();

    return ProjectsModel
    .forge({
      title: this.ensureRemixSuffix(this.publishedProjectsModel.get(`title`)),
      user_id: this.user.id,
      tags: this.publishedProjectsModel.get(`tags`),
      description: this.publishedProjectsModel.get(`description`),
      date_created: now,
      date_updated: now
    })
    .save()
    .then(remixedProject => {
      this.remixedProject = remixedProject;
    });
  }

  _getFilesToRemix() {
    return Promise.fromCallback(next => {
      return this.server.methods.publishedFilesByPublishedProject(this.publishedProjectsModel.get(`id`), next);
    });
  }

  _createRemixFiles(filesToRemix) {
    return Promise.map(filesToRemix, publishedFile => {
      const remixedFileBuffer = publishedFile.buffer;

      return FilesModel
      .forge({
        path: publishedFile.path,
        project_id: this.remixedProject.get(`id`),
        buffer: remixedFileBuffer
      })
      .save()
      .then(fileModel => {
        return Promise.fromCallback(next => {
          return this.server.methods.file(fileModel.get(`id`), remixedFileBuffer, next);
        });
      });
    });
  }

  save() {
    return this._createProjectRemix()
    .then(() => this._getFilesToRemix())
    .then(filesToRemix => this._createRemixFiles(filesToRemix))
    .then(() => this.remixedProject);
  }
}

class PublishedProjectsController extends BaseController {
  constructor() {
    super(PublishedProjectsModel);
  }

  formatResponseData(model) {
    return DateTracker.convertToISOStrings(model);
  }

  create(request, reply) {
    return super.create(request, reply, DateTracker.convertToISOStringsForModel);
  }

  update(request, reply) {
    return super.update(request, reply, DateTracker.convertToISOStringsForModel);
  }

  remix(request, reply) {
    const publishedProjectsModel = request.pre.records.models[0];
    const user = request.pre.user;
    const remix = new Remix(publishedProjectsModel, user, request.server);

    const result = remix
    .save()
    .then(DateTracker.convertToISOStringsForModel)
    .catch(Errors.generateErrorResponse);

    return reply(result);
  }

  exportStart(request, reply) {
    const publishedProject = request.pre.records.models[0];
    const exportPublishedProjectCache = request.server.methods.exportPublishedProject;
    const publishedProjectIdentifier = { id: publishedProject.get(`id`) };

    return reply(
      Promise.fromCallback(next =>
        exportPublishedProjectCache(publishedProjectIdentifier, next)
      )
      .then(token => request.generateResponse({ token }).code(201))
      .catch(Errors.generateErrorResponse)
    );
  }

  exportProjectData(request, reply) {
    const publishedProject = request.pre.records.models[0];

    return reply(PublishedFilesModel.query({
      where: {
        published_id: publishedProject.get(`id`)
      }
    })
    .fetchAll({ columns: [`id`, `path`] })
    .then(publishedFiles => {
      if (!publishedFiles) {
        publishedFiles = [];
      }

      return this._getFileTarStream(PublishedFilesModel, publishedFiles);
    }))
    .header(`Content-Type`, `application/octet-stream`);
  }
}

module.exports = new PublishedProjectsController();
