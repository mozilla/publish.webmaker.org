var retrieveTestFiles = require('../files/test-files');
var retrieveTestProjects = require('../projects').testProjects;

var validFiles;
var invalidFile;

var validProjects;
var invalidProject;

var getOne = {};

function generateUrl(opts) {
  return '/files/' + opts.fileid;
}

module.exports = function(cb) {
  if (getOne.success) {
    return cb(null, getOne);
  }

  retrieveTestFiles(function(err, files) {
    if (err) return cb(err);

    validFiles = files.valid;
    invalidFile = files.invalid;

    retrieveTestProjects(function(err, projects) {
      if (err) return cb(err);

      validProjects = projects.valid;
      invalidProject = projects.invalid;

      getOne.success = {
        default: {
          url: '/files/' + validFiles[0].id,
          method: 'get'
        }
      };

      getOne.fail = {
        invalidUserid: {
          url: '/files/' + validFiles[0].id,
          method: 'get'
        },
        invalidProjectid: {
          url: '/files/' + validFiles[0].id,
          method: 'get'
        },
        invalidFileid: {
          url: '/files/' + invalidFile.id,
          method: 'get'
        }
      };

      cb(null, getOne);
    });
  });
}
