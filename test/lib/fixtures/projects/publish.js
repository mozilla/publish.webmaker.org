var retrieveTestProjects = require('./test-projects');

var validProjects;

var publish = {};

module.exports = function(cb) {
  if (publish.success) {
    return cb(null, publish);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;

    publish.success = {
      default: {
        url: '/projects/' + validProjects[0].id + '/publish',
        method: 'POST'
      }
    };

    publish.fail = {
      projectDoesNotExist: {
        url: '/projects/999999/publish',
        method: 'POST'
      projectidTypeError: {
        url: '/projects/thisisastring/publish',
        method: 'POST'
      }
    };

    cb(null, publish);
  });
}
