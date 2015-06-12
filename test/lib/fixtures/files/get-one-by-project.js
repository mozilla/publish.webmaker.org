var retrieveTestFiles = require('../files/test-files');
var retrieveProjectFiles = require('../projects').testProjects;

var validFiles;
var invalidFile;

var validProjects;
var invalidProject;

var getOneByProject = {};

module.exports = function(cb) {
  if (getOneByProject.success) {
    return cb(null, getOneByProject);
  }

  retrieveTestFiles(function(err, files) {
    if (err) return cb(err);

    validFiles = files.valid;
    invalidFile = files.invalid;

    retrieveProjectFiles(function(err, projects) {
      if (err) return cb(err);

      validProjects = projects.valid;
      invalidProject = projects.invalid;

      getOneByProject.success = {
        default: {
          url: '/projects/' + validProjects[0].id + '/files/' + validFiles[0].id,
          method: 'get'
        }
      };

      getOneByProject.fail = {
        projectDoesNotExist: {
          url: '/projects/' + 9999999 + '/files/' + validFiles[0].id,
          method: 'get'
        },
        invalidProjectId: {
          url: '/projects/' + invalidProject.id + '/files/' + validFiles[0].id,
          method: 'get'
        },
        fileDoesNotExist: {
          url: '/projects/' + validProjects[0].id + '/files/' + 9999999,
          method: 'get'
        },
        invalidFileId: {
          url: '/projects/' + validProjects[0].id + '/files/' + invalidFile.id,
          method: 'get'
        }
      };

      cb(null, getOneByProject);
    });
  });
}
