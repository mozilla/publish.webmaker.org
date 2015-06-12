var retrieveTestProjects = require('../projects').testProjects;

var validProjects;
var invalidProject;

var del = {};

module.exports = function(cb) {
  if (del.success) {
    return cb(null, del);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    del.fail = {
      fileDoesNotExist: {
        url: '/files/999999',
        method: 'delete'
      },
      fileidTypeError: {
        url: '/files/thisisastring',
        method: 'delete'
      }
    };

    cb(null, del);
  });
}
