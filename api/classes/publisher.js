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

function buildUrl(project) {
  var url = process.env.PUBLIC_PROJECT_ENDPOINT + '/' +
            project.get('user_id') + '/' +
            project.get('title');
  return url;
}

function uploadFile(file, userId) {
  return new Promise(function(resolve, reject) {
    var buffer = file.get('buffer');
    var path = '/' + userId + file.get('path');
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

function deleteFile(file, userId) {
  var path = '/' + userId + file.get('path');

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

function modifyFiles(action, project) {
  return File.query({
    where: {
      project_id: project.id
    }
  }).fetchAll()
  .then(function(records) {
    var fn = action === 'publish' ? uploadFile : deleteFile;

    return records.mapThen(function(record) {
      return fn(record, project.get('user_id'));
    });
  })
  .catch(function(e) {
    return Promise.reject(e);
  });
}

exports.publish = function(project) {
  return modifyFiles('publish', project)
    .then(function() {
      return project.set({
        publish_url: buildUrl(project)
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
  return modifyFiles('unpublish', project)
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
