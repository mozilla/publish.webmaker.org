var retrieveTestProjects = require('./test-projects');

var validProjects;

var unpublish = {};

module.exports = function(cb) {
  if (unpublish.success) {
    return cb(null, unpublish);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;

    unpublish.success = {
      default: {
        url: '/projects/' + validProjects[0].id + '/unpublish',
        method: 'POST'
      }
    };

    unpublish.fail = {
      projectDoesNotExist: {
        url: '/projects/999999/unpublish',
        method: 'POST'
      },
      projectidTypeError: {
        url: '/projects/thisisastring/unpublish',
        method: 'POST'
      }
    };

    cb(null, unpublish);
  });
}
