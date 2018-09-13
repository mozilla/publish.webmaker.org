"use strict";

const Boom = require(`boom`);
const Promise = require(`bluebird`);

const Bookshelf = require(`../../classes/database`).Bookshelf;
const Errors = require(`../../classes/errors`);
const BaseController = require(`../../classes/base_controller`);
const Publisher = require(`../../classes/publisher`);

const FilesModel = require(`../files/model`);

const ProjectsModel = require(`./model`);

const DateTracker = require(`../../../lib/utils`).DateTracker;
const publishedProjectsQueryBuilder = require(`../publishedProjects/model`).prototype.queryBuilder();

class ProjectsController extends BaseController {
  constructor() {
    super(ProjectsModel);
  }

  formatRequestData(request) {
    const payload = request.payload;
    const now = new Date();
    const data = {
      title: payload.title,
      user_id: payload.user_id,
      tags: payload.tags,
      description: payload.description,
      date_created: now,
      date_updated: now,
      readonly: payload.readonly,
      client: payload.client
    };

    // If it is an update request
    if (request.params.id) {
      data.id = parseInt(request.params.id);
      delete data.date_created;
    }

    return data;
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

  _deletePublishedProject(project, user) {
    return Promise.resolve().then(function() {
      const publishedProjectId = project.get(`published_id`);

      if (!publishedProjectId) {
        return Promise.resolve();
      }

      const username = user.name;
      const publishRoot = Publisher.getUploadRoot(project.get(`client`), user, project.toJSON());

      return Publisher.deletePublishedFilesRemotely(
        publishedProjectId,
        publishRoot,
        Publisher.success(`DELETE`, username),
        Publisher.failure(`DELETE`, username)
      )
      .then(function() {
        return project.set({
          "published_id": null
        })
        .save();
      })
      .then(function(updatedProject) {
        project = updatedProject;

        return publishedProjectsQueryBuilder.deleteOne(publishedProjectId);
      });
    })
    .then(() => project);
  }

  delete(request, reply) {
    const project = request.pre.records.models[0];
    const projectId = project.get(`id`);
    let user = request.pre.user;

    if (!user.name) {
      user = user.toJSON();
    }

    const result = this._deletePublishedProject(project, user)
    .then(unpublishedProject => unpublishedProject.destroy())
    .then(() => Promise.fromCallback(
      next => request.server.methods.userForProject.cache.drop(projectId, next)
    ))
    .then(() => request.generateResponse().code(204))
    .catch(Errors.generateErrorResponse);

    return reply(result);
  }

  publish(request, reply) {
    const project = request.pre.records.models[0];
    const publisher = new Publisher(project, request.server);
    const readonly = request.query.readonly;

    const result = publisher
    .publish(readonly)
    .then(DateTracker.convertToISOStringsForModel)
    .then(function(publishedModel) {
      return request.generateResponse(publishedModel).code(200);
    })
    .catch(Errors.generateErrorResponse);

    return reply(result);
  }

  unpublish(request, reply) {
    const project = request.pre.records.models[0];
    const publisher = new Publisher(project, request.server);

    if (!project.attributes.publish_url) {
      return reply(Errors.generateErrorResponse(
        Boom.notFound(null, {
          debug: true,
          error: `This project was not published`
        })
      ));
    }

    const result = publisher
    .unpublish()
    .then(DateTracker.convertToISOStringsForModel)
    .then(function(unpublishedModel) {
      return request.generateResponse(unpublishedModel).code(200);
    })
    .catch(Errors.generateErrorResponse);

    return reply(result);
  }

  updatePaths(request, reply) {
    const projectId = request.pre.records.models[0].get(`id`);
    const renamedPaths = request.payload;

    function renameOperation(transaction) {
      return Promise.map(Object.keys(renamedPaths), function(oldPath) {
        return FilesModel.query({
          where: {
            path: oldPath,
            project_id: projectId
          }
        })
        .fetch({ transacting: transaction })
        .then(function(file) {
          if(!file) {
            // We ignore file paths that were not found
            // so that we do not fail the entire operation
            // because of one bad value
            return Promise.resolve();
          }

          file.set({ path: renamedPaths[oldPath] });

          return file.save(file.changed, {
            patch: true,
            method: `update`,
            transacting: transaction
          });
        });
      }, { concurrency: 3 });
    }

    const result = Bookshelf.transaction(renameOperation)
    .then(function() { return request.generateResponse().code(200); })
    .catch(Errors.generateErrorResponse);

    return reply(result);
  }

  exportStart(request, reply) {
    const project = request.pre.records.models[0];
    const exportProjectCache = request.server.methods.exportProject;
    const projectIdentifier = { id: project.get(`id`) };

    return reply(
      Promise.fromCallback(next => exportProjectCache(projectIdentifier, next))
      .then(token => request.generateResponse({ token }).code(200))
      .catch(Errors.generateErrorResponse)
    );
  }
}

module.exports = new ProjectsController();
