var Promise = require('bluebird');

var noxmox = require('noxmox');

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

var log = require('../../logger.js');
var File = require('../modules/Files/model');

function modifyFiles(action, project) {
  return File.query({
    where: {
      project_id: project.id
    }
  }).fetchAll()
  .then(function(records){
    var fn = action === 'publish' ? uploadFile : deleteFile;

    return records.mapThen(function(record) {
      return fn(record, project.get('user_id'));
    });
  })
  .catch(function(e) {
    return Promise.reject(e);
  });
};

function uploadFile(file, userId) {
  return new Promise(function(resolve, reject) {
    var buffer = file.get('buffer');
    var path = '/' + userId + file.get('path');
    var headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Length': buffer.length,
      'x-amz-acl': 'public'
    };

    var request = client.put(path, headers);
    request.on('error', function(err) {
      reject(err);
    });
    request.on('continue', function() {
      request.end(buffer);
    });
    request.on('response', function(res) {
      res.on('error', function(err) {
        reject(err);
      });
      res.on('end', function() {
        if (res.statusCode === 200) {
          log.info('Successfully uploaded ' + path);
          resolve();
        } else {
          reject('S3 upload returned ' + res.statusCode);
        }
      });
    });
  });
}

function deleteFile(file, userId) {
  var path = '/' + userId + file.get('path');

  return new Promise(function(resolve, reject) {
    var request = client.del(path);
    request.end();
    request.on('error', function(err) {
      reject(err);
    });
    request.on('response', function(res) {
      res.on('end', function() {
        if (res.statusCode === 204) {
          log.info('Successfully deleted ' + path);
          resolve();
        } else {
          reject('S3 delete returned ' + res.statusCode);
        }
      });
    });
  });
}

function buildUrl(project) {
  var url = process.env.PUBLIC_PROJECT_ENDPOINT + '/' +
            process.env.AWS_BUCKET + '/' +
            project.get('user_id') + '/' +
            project.get('title');
  return url;
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
    .catch(function(e){
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
