var retrieveTestProjects = require('../projects').testProjects;

var validProjects;
var invalidProject;

var create = {};

function generateUrl(opts) {
  return '/files/' + opts.fileid;
}

module.exports = function(cb) {
  if (create.success) {
    return cb(null, create);
  }

  retrieveTestProjects(function(err, projects) {
    if (err) return cb(err);

    validProjects = projects.valid;
    invalidProject = projects.invalid;

    create.success = {
      default: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: '/test.txt',
          data: new Buffer('test')
        }
      }
    };

    create.fail = {
      projectDoesNotExist: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: 9999999,
          path: '/test.txt',
          data: new Buffer('test')
        }
      },
      projectidTypeError: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: "thisisastring",
          path: '/test.txt',
          data: new Buffer('test')
        }
      },
      pathTypeError: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: 1234,
          data: new Buffer('test')
        }
      },
      dataTypeError: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: '/test.txt',
          data: "thisisastring"
        }
      },
      payloadAbsent: {
        url: '/files',
        method: 'post',
        payload: {}
      },
      projectidAbsent: {
        url: '/files',
        method: 'post',
        payload: {
          path: '/test.txt',
          data: new Buffer('test')
        }
      },
      pathAbsent: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          data: new Buffer('test')
        }
      },
      dataAbsent: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: '/test.txt',
        }
      },
      duplicatePath: {
        url: '/files',
        method: 'post',
        payload: {
          project_id: validProjects[0].id,
          path: '/test.txt',
          data: new Buffer('test')
        }
      }
    };

    cb(null, create);
  });
}
