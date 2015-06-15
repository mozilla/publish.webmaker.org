var retrieveTestFiles = require('./test-files');
var retrieveProjectFiles = require('../projects').testProjects

var validFiles;
var invalidFile;

var validProjects;
var invalidProject;

var update = {};

module.exports = function(cb) {
  if (update.success) {
    return cb(null, update);
  }

  retrieveProjectFiles(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    retrieveTestFiles(function(err, files) {
      if (err) return cb(err);

      validFiles = files.valid;
      invalidFile = files.invalid;

      update.success = {
        default: {
          url: '/files/' + validFiles[0].id,
          method: 'put',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt',
            data: new Buffer('test')
          }
        }
      };

      update.fail = {
        fileDoesNotExist: {
          url: '/files/999999',
          method: 'put',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt',
            data: new Buffer('test')
          }
        },
        fileidTypeError: {
          url: '/files/thisisastring',
          method: 'put',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt',
            data: new Buffer('test')
          }
        }
      };

      cb(null, update);
    });
  });

}
