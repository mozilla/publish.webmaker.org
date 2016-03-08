var retrieveTestFiles = require('./test-files');
var retrieveProjectFiles = require('../projects').testProjects;

var validFiles;
var invalidFile;

var validProjects;
var invalidProject;

var updatePath = {};

var validHeaders = {
  authorization: 'token ag-dubs'
};

module.exports = function(cb) {
  if (updatePath.success) {
    return cb(null, updatePath);
  }

  retrieveProjectFiles(function(err, projects) {
    if (err) { return cb(err); }

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    retrieveTestFiles(function(err, files) {
      if (err) { return cb(err); }

      validFiles = files.valid;
      invalidFile = files.invalid;

      updatePath.success = {
        default: {
          headers: validHeaders,
          url: '/files/' + validFiles[0].id + '/path',
          method: 'put',
          payload: {
            path: '/my/new/path'
          }
        }
      };

      updatePath.fail = {
        fileDoesNotExist: {
          headers: validHeaders,
          url: '/files/999999/path',
          method: 'put',
          payload: {
            path: '/my/new/path'
          }
        },
        fileidTypeError: {
          headers: validHeaders,
          url: '/files/thisisastring/path',
          method: 'put',
          payload: {
            path: '/my/new/path'
          }
        }
      };

      cb(null, updatePath);
    });
  });
};
