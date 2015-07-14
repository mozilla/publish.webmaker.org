var retrieveTestProjects = require('../projects').testProjects;

var validProjects;
var invalidProject;

var del = {};

var userToken = {
  authorization: 'token ag-dubs'
};

module.exports = function(cb) {
  if (del.success) {
    return cb(null, del);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) { return cb(err); }

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    // This is used to create a file record, which is then
    // deleted.
    del.success = {
      default: {
        headers: userToken,
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
        headers: userToken,
        url: '/files/999999',
        method: 'delete'
      },
      fileidTypeError: {
        headers: userToken,
        url: '/files/thisisastring',
        method: 'delete'
      }
    };

    cb(null, del);
  });
};
