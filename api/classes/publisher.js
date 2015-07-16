var Promise = require('bluebird');
var noxmox = require('noxmox');
var mime = require('mime');

var client;

if (process.env.S3_EMULATION) {
  process.env.AWS_BUCKET = 'test';

  client = noxmox.mox.createClient({
    key: 'local',
    secret: 'host',
    bucket: process.env.AWS_BUCKET
  });
} else {
  client = noxmox.nox.createClient({
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET
  });
}

var log = require('../../lib/logger.js');
var File = require('../modules/files/model');

function buildUrl(project, user) {
  var url = process.env.PUBLIC_PROJECT_ENDPOINT + '/' +
            user.get('name') + '/' +
            project.get('id');
  return url;
}

function uploadFile(file, root) {
  return new Promise(function(resolve, reject) {
    var buffer = file.get('buffer');
    var path = root + file.get('path');
    var headers = {
      'Cache-Control': 'private max-age=0',
      'Content-Type': mime.lookup(path),
      'Content-Length': buffer.length,
      'x-amz-acl': 'public-read'
    };

    var request = client.put(path, headers);
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

function deleteFile(file, root) {
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

function modifyFiles(action, project, user) {
  return File.query({
    where: {
      project_id: project.id
    }
  }).fetchAll()
  .then(function(records) {
    return records.mapThen(function(record) {
      return action(record, '/' + user.get('name') + '/' + project.get('id'));
    });
  })
  .then(function() {
    return buildUrl(project, user);
  })
  .catch(function(e) {
    return Promise.reject(e);
  });
}

function getUser(project) {
  return project.user().query({}).fetch();
}

exports.publish = function(project) {
  return getUser(project)
    .then(function(user) {
      return modifyFiles(uploadFile, project, user);
    })
    .then(function(url) {
      return project.set({
        publish_url: url
      }).save();
    })
    .then(function() {
      log.info(
        'Successfully published ' +
        project.get('title') +
        ' to ' + project.get('publish_url')
      );
    })
    .catch(function(e) {
      log.error(e);

      return Promise.reject(e);
    });
};

exports.unpublish = function(project) {
  return getUser(project)
    .then(function(user) {
      return modifyFiles(deleteFile, project, user);
    })
    .then(function() {
      return project.set({ publish_url: null }).save();
    })
    .then(function() {
      log.info(
        'Successfully unpublished ' +
        project.get('title')
      );
    })
    .catch(function(e) {
      log.error(e);

      return Promise.reject(e);
    });
};

module.exports = exports;
