var retrieveTestProjects = require('../projects').testProjects;
var retrieveTestFiles = require('./test-files');

var validProjects;
var invalidProject;

var validFiles;

var create = {};

// We get buffers from the client as arrays of octets
var testBuffer = (new Buffer('test')).toJSON().data;

var userToken = {
  authorization: 'token ag-dubs'
};

module.exports = function(cb) {
  if (create.success) {
    return cb(null, create);
  }

  retrieveTestFiles(function(err, files) {
    if (err) { return cb(err); }

    validFiles = files.valid;

    retrieveTestProjects(function(err, projects) {
      if (err) { return cb(err); }

      validProjects = projects.valid;
      invalidProject = projects.invalid;

      create.success = {
        default: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt',
            buffer: testBuffer
          }
        }
      };

      create.fail = {
        projectDoesNotExist: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: 9999999,
            path: '/test.txt',
            buffer: testBuffer
          }
        },
        projectidTypeError: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: 'thisisastring',
            path: '/test.txt',
            buffer: testBuffer
          }
        },
        pathTypeError: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            path: 1234,
            buffer: testBuffer
          }
        },
        bufferTypeError: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt',
            buffer: 'thisisastring'
          }
        },
        payloadAbsent: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {}
        },
        projectidAbsent: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            path: '/test.txt',
            buffer: testBuffer
          }
        },
        pathAbsent: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            buffer: testBuffer
          }
        },
        dataAbsent: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            path: '/test.txt'
          }
        },
        duplicatePath: {
          headers: userToken,
          url: '/files',
          method: 'post',
          payload: {
            project_id: validProjects[0].id,
            path: validFiles[0].path,
            buffer: testBuffer
          }
        }
      };

      cb(null, create);
    });
  });
};
