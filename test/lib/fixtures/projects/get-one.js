var retrieveTestProjects = require('./test-projects');

var validProjects;
var invalidProject;

var getOne = {};

module.exports = function(cb) {
  if (getOne.success) {
    return cb(null, getOne);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    getOne.success = {
      default: {
        url: '/projects/' + validProjects[0].id,
        method: 'get'
      }
    };

    getOne.fail = {
      invalidProjectid: {
        url: '/projects/thisisastring',
        method: 'get'
      },
      projectDoesNotExist: {
        url: '/projects/' + 9999999,
        method: 'get'
      }
    };

    cb(null, getOne);
  });
}
