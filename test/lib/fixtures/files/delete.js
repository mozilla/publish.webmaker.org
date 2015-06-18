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

    // This is used to create a file record, which is then
    // deleted.
    del.success = {
      default: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: '/test.txt',
          buffer: (new Buffer('test')).toJSON().data
        }
      }
    };

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
