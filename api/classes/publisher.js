'use strict';

var Promise = require(`bluebird`);
var mime = require(`mime`);
var Path = require(`path`);

var client = require(`../../lib/amazon-client`).create();

var log = require(`../../lib/logger.js`);
var Remix = require(`../../lib/remix`);

var Projects = require(`../modules/projects/model`);
var PublishedProjects = require(`../modules/publishedProjects/model`);

// SQL Query Generators
var UserQueries = require(`../modules/users/model`).prototype.queries();
var ProjectQueries = Projects.prototype.queries();
var PublishedProjectQueries = PublishedProjects.prototype.queries();
var PublishedFileQueries = require(`../modules/publishedFiles/model`).prototype.queries();

var rejectPromise = Promise.reject;

/**
 * Utility functions
 */

function success(type, username) {
  return function(message) {
    log.info(`Publish for ` + username + ` - [` + type + `] ` + message);
  };
}

function failure(type, username) {
  return function(err) {
    log.error({ error: err }, `Publish for ` + username + ` - [` + type + `]`);
    rejectPromise(err);
  };
}

function getUploadRoot(user, project) {
  if (!user || !project) {
    return null;
  }

  return `/` + user.name + `/` + project.id;
}

function buildUrl(user, project) {
  if (!user || !project) {
    return null;
  }

  return process.env.PUBLIC_PROJECT_ENDPOINT + getUploadRoot(user, project);
}

// Takes an absolute path and uri-encodes each component
// of the path to return a fully uri safe path
function uriSafe(path) {
  if (path === `/`) {
    return `/`;
  }

  var uriSafePath = ``;

  while (path !== `/`) {
    uriSafePath = Path.join(`/`, encodeURIComponent(Path.basename(path)), uriSafePath);
    path = Path.dirname(path);
  }

  return uriSafePath;
}


/**
 * Remote communication helpers
 */

function upload(path, buffer, remixMetadata) {
  var mimeType = mime.lookup(path);

  if (mimeType === `text/html` && !remixMetadata.readonly) {
    buffer = new Buffer(Remix.inject(buffer.toString(), remixMetadata));
  }

  var headers = {
    'Cache-Control': `max-age=0`,
    'Content-Type': mimeType + `; charset=utf-8`,
    'Content-Length': buffer.length
  };

  var request = client.put(uriSafe(path), headers);

  return new Promise((resolve, reject) => {
    request.on(`error`, reject);
    request.on(`continue`, () => {
      request.end(buffer);
    });
    request.on(`response`, res => {
      if (res.statusCode === 200) {
        resolve(`Uploaded "` + path + `"`);
      } else {
        reject(`S3 upload returned ` + res.statusCode);
      }
    });
  });
}

function remove(path) {
  return new Promise((resolve, reject) => {
    var request = client.del(uriSafe(path));

    request.on(`error`, reject);
    request.on(`response`, res => {
      if (res.statusCode === 204) {
        resolve(`Deleted "` + path + `"`);
      } else {
        reject(`S3 delete returned ` + res.statusCode);
      }
    });
    request.end();
  });
}


/**
 * Record fetching helpers
 */

function fetchProjectModel(id) {
  // We do not use the `ProjectQueries` interface here since we only want
  // a Bookshelf model to be returned. The `ProjectQueries` interface returns
  // plain javascript objects. This method is primarily used when we want to
  // output the same form of data that was sent as an input viz. a Bookshelf
  // model.
  return Projects.query({
    where: {
      id: id
    }
  }).fetch();
}

function fetchUserForProject() {
  var self = this;

  return UserQueries.getOne(self.project.user_id)
  .then(user => {
    self.user = user;
    return user;
  });
}

function fetchPublishedProject() {
  var self = this;

  return PublishedProjectQueries.getOne(self.project.published_id)
  .then(publishedProject => {
    self.publishedProject = publishedProject;
    self.publishRoot = getUploadRoot(self.user, publishedProject);
    return publishedProject;
  });
}


/**
 * Record update helpers
 */

function updateProjectDetails() {
  var self = this;
  var publishedProject = self.publishedProject;

  return ProjectQueries
  .updateOne(self.project.id, {
    publish_url: buildUrl(self.user, publishedProject),
    published_id: publishedProject && publishedProject.id
  })
  .then(ProjectQueries.getOne)
  .then(project => {
    self.project = project;
  });
}

function setRemixDataForPublishedProject() {
  var self = this;

  self.remixData = {
    projectId: self.publishedProject.id,
    projectTitle: self.publishedProject.title,
    projectAuthor: self.user.name,
    dateUpdated: self.publishedProject.date_updated.toISOString(),
    host: Remix.resourceHost,
    readonly: self.project.readonly
  };
}

function createOrUpdatePublishedProject() {
  var self = this;
  var project = self.project;
  var projectData = {
    title: project.title,
    tags: project.tags,
    description: project.description,
    date_updated: (new Date()).toISOString()
  };

  return fetchPublishedProject.call(self)
  .then(publishedProject => {
    if (publishedProject) {
      return PublishedProjectQueries.updateOne(publishedProject.id, projectData);
    } else {
      projectData.date_created = projectData.date_updated;
      return PublishedProjectQueries.createOne(projectData);
    }
  })
  .then(PublishedProjectQueries.getOne)
  .then(publishedProject => {
    self.publishedProject = publishedProject;
    self.publishRoot = getUploadRoot(self.user, publishedProject);
  });
}


/**
 * Remote record update helpers
 */

function uploadNewFiles() {
  var self = this;
  var remixData = self.remixData;
  var publishedProject = self.publishedProject;
  var fileRoot = self.publishRoot;
  var username = self.user.name;

  return PublishedFileQueries
  .getAllNewFiles(self.project.id)
  .then(files => {
    if (!files.length) {
      return;
    }

    return Promise.map(files, file => {
      return PublishedFileQueries.createOne({
        file_id: file.id,
        published_id: publishedProject.id,
        path: file.path,
        buffer: file.buffer
      })
      .then(() => {
        return upload(fileRoot + file.path, file.buffer, remixData);
      })
      .then(success(`CREATE`, username))
      .catch(failure(`CREATE`, username));
    });
  });
}

function uploadModifiedFiles() {
  var self = this;
  var remixData = self.remixData;
  var fileRoot = self.publishRoot;
  var username = self.user.name;

  function updateModelAndUpload(publishedFile) {
    var id = publishedFile.id;

    delete publishedFile.id;

    return PublishedFileQueries
      .updateOne(id, publishedFile)
      .then(() => {
        return upload(fileRoot + publishedFile.path, publishedFile.buffer, remixData);
      })
      .then(success(`UPDATE`, username))
      .catch(failure(`UPDATE`, username));
  }

  return PublishedFileQueries
  .getAllModifiedFiles(self.publishedProject.id)
  .then(publishedFiles => {
    if (!publishedFiles.length) {
      return;
    }

    return Promise.map(publishedFiles, publishedFile => {
      var oldPath = publishedFile.oldPath;

      delete publishedFile.oldPath;

      if (oldPath === publishedFile.path) {
        return updateModelAndUpload(publishedFile);
      }

      return remove(fileRoot + oldPath)
      .then(() => {
        return updateModelAndUpload(publishedFile);
      });
    });
  });
}


/**
 * Record deletion helpers
 */

function deletePublishedProject() {
  var self = this;
  var publishedProjectId = self.publishedProject.id;

  self.publishUrl = self.project.publish_url;
  self.publishedProject = null;

  return updateProjectDetails.call(self)
  .then(() => {
    return PublishedProjectQueries.deleteOne(publishedProjectId);
  });
}

function deletePublishedFiles() {
  var self = this;
  var fileRoot = self.publishRoot;
  var username = self.user.name;

  return PublishedFileQueries
  .getAllPaths(self.publishedProject.id)
  .then(publishedFilePaths => {
    return Promise.map(publishedFilePaths, publishedFilePath => {
      return remove(fileRoot + publishedFilePath)
      .then(success(`DELETE`, username))
      .catch(failure(`DELETE`, username));
    });
  })
  .then(() => {
    return PublishedFileQueries.deleteAll(self.publishedProject.id);
  });
}

function deleteOldFiles() {
  var self = this;
  var fileRoot = self.publishRoot;
  var username = self.user.name;

  return PublishedFileQueries
  .getAllDeletedFiles(self.publishedProject.id)
  .then(publishedFiles => {
    if (!publishedFiles.length) {
      return;
    }

    return Promise.map(publishedFiles, publishedFile => {
      return PublishedFileQueries
      .deleteOne(publishedFile.id)
      .then(() => {
        return remove(fileRoot + publishedFile.path);
      })
      .then(success(`DELETE`, username))
      .catch(failure(`DELETE`, username));
    });
  });
}


/**
 * API
 */

module.exports.publish = function(project) {
  var context = {
    project: project.toJSON()
  };

  return Promise.resolve()
  .then(fetchUserForProject.bind(context))
  .then(createOrUpdatePublishedProject.bind(context))
  .then(setRemixDataForPublishedProject.bind(context))
  .then(uploadNewFiles.bind(context))
  .then(uploadModifiedFiles.bind(context))
  .then(deleteOldFiles.bind(context))
  .then(updateProjectDetails.bind(context))
  .then(() => {
    log.info(`Publish for ` + context.user.name + ` - ` +
             `[PUBLISH] Published ` +
             `"` + context.project.title + `"` +
             ` to ` + context.project.publish_url);

    return context.project.id;
  })
  .then(fetchProjectModel)
  .catch(rejectPromise);
};

module.exports.unpublish = function(project) {
  var context = {
    project: project.toJSON()
  };

  return Promise.resolve()
  .then(fetchUserForProject.bind(context))
  .then(fetchPublishedProject.bind(context))
  .then(deletePublishedFiles.bind(context))
  .then(deletePublishedProject.bind(context))
  .then(() => {
    log.info(`Publish for ` + context.user.name + ` - ` +
             `[UNPUBLISH] Unpublished ` +
             `"` + context.project.title + `"` +
             ` from ` + context.publishUrl);

    return context.project.id;
  })
  .then(fetchProjectModel)
  .catch(rejectPromise);
};
