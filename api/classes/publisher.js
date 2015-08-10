var Promise = require('bluebird');
var mime = require('mime');

var client = require('../../lib/amazon-client').create();

var log = require('../../lib/logger.js');
var Remix = require('../../lib/remix');

var File = require('../modules/files/model');
var PublishedFiles = require('../modules/publishedFiles/model');
var PublishedProject = require('../modules/publishedProjects/model');

/**
 * Utility functions
 */
function reject(e) {
  return Promise.reject(e);
}

function buildUrl(project, user) {
  var url = process.env.PUBLIC_PROJECT_ENDPOINT + '/' +
            user.get('name') + '/' +
            project.get('id');
  return url;
}

/**
 * Model retrieval functions
 */
function getUserForProject(project) {
  return project.user().query({}).fetch();
}

function getPublishedProject(project) {
  return PublishedProject.query({
    where: {
      id: project.get('published_id')
    }
  }).fetch();
}

function getPublishedFiles(publishedProject) {
  return PublishedFiles.query({
    where: {
      published_id: publishedProject.get('id')
    }
  }).fetchAll();
}

/**
 * Publish helpers
 */
function upload(path, buffer, mimeType) {
  var headers = {
    'Cache-Control': 'max-age=0',
    'Content-Type': mimeType,
    'Content-Length': buffer.length
  };

  var request = client.put(path, headers);

  return new Promise(function(resolve, reject) {
    request.on('error', function(err) {
      reject(err);
    });
    request.on('continue', function() {
      request.end(buffer);
    });
    request.on('response', function(res) {
      if (res.statusCode === 200) {
        log.info('Successfully uploaded ' + path);
        resolve();
      } else {
        reject('S3 upload returned ' + res.statusCode);
      }
    });
  });
}

function uploadFile(file, root, remixMetadata) {
  var buffer = file.get('buffer');
  var path = root + file.get('path');
  var mimeType = mime.lookup(path);

  if (mimeType === 'text/html') {
    buffer = new Buffer(Remix.inject(buffer.toString(), remixMetadata));
  }

  return upload(path, buffer, mimeType);
}

function deleteFileRemotely(file, root) {
  var path = root + file.get('path');

  return new Promise(function(resolve, reject) {
    var request = client.del(path);
    request.on('error', function(err) {
      reject(err);
    });
    request.on('response', function(res) {
      if (res.statusCode === 204) {
        log.info('Successfully deleted ' + path);
        resolve();
      } else {
        reject('S3 delete returned ' + res.statusCode);
      }
    });
    request.end();
  });
}

function modifyPublishedFiles(action, project, user, files, remixMetadata) {
  return Promise.resolve()
  .then(function() {
    if (files.length) {
      return files.mapThen(function(file) {
        return action(file, '/' + user.get('name') + '/' + project.get('id'), remixMetadata);
      });
    }
    return action(files, '/' + user.get('name') + '/' + project.get('id'), remixMetadata);
  });
}

/**
 * Exports
 */
exports.publish = function publish(project) {
  var user;
  var files;

  var publishedFiles;
  var publishedProject;
  var remixMetadata;

  var projectFiles = {};
  var publishedProjectFiles = {};
  var toBeCreated = [];
  var toBeDeleted = [];
  var toBeUpdated = [];

  return Promise.resolve()
  // First, collect the related user
  .then(function() {
    return getUserForProject(project)
    .then(function(u) {
      user = u;
    });
  })
  // Then, collect or create the current project's publishedProject
  .then(function() {
    return getPublishedProject(project)
    .then(function(oldPublishedProject) {
      if (oldPublishedProject) {
        return oldPublishedProject.set({
          title: project.get('title'),
          tags: project.get('tags'),
          description: project.get('description')
        }).save();
      }
      return PublishedProject.forge({
        title: project.get('title'),
        tags: project.get('tags'),
        description: project.get('description')
      }).save();
    })
    .then(function(p) {
      publishedProject = p;
      remixMetadata = {
        projectId: publishedProject.get('id'),
        projectTitle: publishedProject.get('title'),
        projectAuthor: user.get('name'),
        dateUpdated: project.get('date_updated'),
        host: Remix.resourceHost
      };
    });
  })
  // Then, fetch all the project's files
  .then(function() {
    return File.query({
      where: {
        project_id: project.get('id')
      }
    }).fetchAll()
    .then(function(f) {
      if (f.length === 0) {
        throw 'No files to be published!';
      }

      files = f;
    });
  })
  // Then, fetch all the publishedProject's files (if any)
  .then(function() {
    return PublishedFiles.query({
      where: {
        published_id: publishedProject.get('id')
      }
    }).fetchAll()
    .then(function(f) {
      if (f.length === 0) {
        return;
      }
      publishedFiles = f;
    });
  })
  // Then, identify which files need to be remotely republished,
  // deleted or created
  .then(function() {
    // We organize the project's 'file' objects by id
    files.forEach(function(file) {
      projectFiles[file.get('id')] = file;
    });
    var filePrimaryKeys = Object.keys(projectFiles);

    // Nothing published yet?
    if (!publishedFiles) {
      return filePrimaryKeys.forEach(function(id) {
        toBeCreated.push(projectFiles[id]);
      });
    }

    // In this step we:
    //   1) Organize our 'publishedFile' collection to be keyed on
    //      their foreign key reference to the related 'file'
    //   2) Collect an array of 'publishedFile' objects whose related
    //      'file' object has been deleted. These must be unpublished later
    publishedFiles.forEach(function(publishedFile) {
      if (publishedFile.get('file_id') === null) {
        toBeDeleted.push(publishedFile);
        return;
      }
      publishedProjectFiles[publishedFile.get('file_id')] = publishedFile;
    });
    var publishedFileForeignKeys = Object.keys(publishedProjectFiles);

    // Next, we identify which 'files' are new since this project was last
    // published.
    filePrimaryKeys.forEach(function(primaryKey) {
      if (publishedFileForeignKeys.indexOf(primaryKey) === -1) {
        toBeCreated.push(projectFiles[primaryKey]);
      }
    });

    // The last step identifies which 'files' have already been published
    // and don't require deletion
    publishedFileForeignKeys.forEach(function(foreignKey) {
      if (filePrimaryKeys.indexOf(foreignKey) !== -1) {
        toBeUpdated.push(publishedProjectFiles[foreignKey]);
      }
    });
  })
  // Then, we create 'publishedFile' objects for all new 'files' since last publish
  .then(function() {
    if (toBeCreated.length === 0) {
      return;
    }

    return Promise.map(toBeCreated, function(file) {
      return PublishedFiles.forge({
        file_id: file.get('id'),
        published_id: publishedProject.get('id'),
        path: file.get('path'),
        buffer: file.get('buffer')
      }).save();
    })
    .then(function(f) {
      return Promise.map(f, function(toBePublished) {
        return modifyPublishedFiles(uploadFile, project, user, toBePublished, remixMetadata);
      });
    });
  })
  // Then, we unpublish and delete 'publishedFile' objects for all newly deleted 'files'
  .then(function() {
    if (toBeDeleted.length === 0) {
      return;
    }

    return Promise.map(toBeDeleted, function(model) {
      return modifyPublishedFiles(deleteFileRemotely, project, user, model)
      .then(function() {
        return model.destroy();
      });
    });
  })
  // Then, we unpublish and republish all remaining 'files' in case the path or
  // data has changed
  .then(function() {
    if (toBeUpdated.length === 0) {
      return;
    }

    return Promise.map(toBeUpdated, function(model) {
      return modifyPublishedFiles(deleteFileRemotely, project, user, model)
      .then(function() {
        var originalFile = projectFiles[model.get('file_id')];

        return model.set({
          path: originalFile.get('path'),
          buffer: originalFile.get('buffer')
        }).save()
        .then(function() {
          return modifyPublishedFiles(uploadFile, project, user, model, remixMetadata);
        });
      });
    });
  })
  // Then, we make sure the project has up-to-date references
  .then(function() {
    return project.set({
      publish_url: buildUrl(project, user),
      published_id: publishedProject.get('id')
    }).save();
  })
  // And finally...
  .then(function() {
    log.info(
      'Successfully published ' +
      project.get('title') +
      ' to ' + project.get('publish_url')
    );
  })
  .catch(reject);
};

exports.unpublish = function unpublish(project) {
  return Promise.join(getUserForProject(project),
                      getPublishedProject(project),
                      function(user, publishedProject) {
    // First, collect published files
    return getPublishedFiles(publishedProject)
    .then(function(files) {
      // Then, remove them from s3
      return modifyPublishedFiles(deleteFileRemotely, project, user, files)
      .then(function() {
        // Then, remove the reference from the parent project
        return project.set({
          published_id: null,
          publish_url: null
        }).save();
      })
      .then(function() {
        // Finally, delete them from the DB in one step
        return publishedProject.destroy();
      });
    });
  })
  .then(function() {
    return project.set({ publish_url: null }).save();
  })
  .then(function() {
    log.info(
      'Successfully unpublished ' +
      project.get('title')
    );
  });
};

module.exports = exports;
