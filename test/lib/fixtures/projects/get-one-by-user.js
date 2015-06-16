var retrieveTestUsers = require('../users').testUsers;
var retrieveTestProjects = require('./test-projects');

var validUsers;
var invalidUser;

var validProjects;
var invalidProject;

var getOneByProject = {};

module.exports = function(cb) {
  if (getOneByProject.success) {
    return cb(null, getOneByProject);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    retrieveTestProjects(function(err, projects) {
      if (err) return cb(err);

      validProjects = projects.valid;
      invalidProject = projects.invalid;

      getOneByProject.success = {
        default: {
          url: '/users/' + validUsers[0].id + '/projects/' + validProjects[0].id,
          method: 'get'
        }
      };

      getOneByProject.fail = {
        userDoesNotExist: {
          url: '/users/' + 999999 + '/projects/' + validProjects[0].id,
          method: 'get'
        },
        invalidUserId: {
          url: '/users/' + invalidUser.id + '/projects/' + validProjects[0].id,
          method: 'get'
        },
        projectDoesNotExist: {
          url: '/users/' + validUsers[0].id + '/projects/' + 9999999,
          method: 'get'
        },
        invalidProjectId: {
          url: '/users/' + validUsers[0].id + '/projects/' + invalidProject.id,
          method: 'get'
        }
      };

      cb(null, getOneByProject);
    });
  });
}
