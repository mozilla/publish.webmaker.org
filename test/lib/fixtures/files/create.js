var retrieveTestProjects = require('../projects').testProjects;
var retrieveTestFiles = require('./test-files');
var utils = require('../../utils');

var validProjects;
var invalidProject;

var validFiles;

var create = {};

var validHeaders = {
  authorization: 'token ag-dubs',
  'content-type': 'multipart/form-data; boundary=AaB03x'
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

      var commonCreatedFilePayload = utils.constructMultipartPayload([{
        name: 'project_id',
        content: validProjects[0].id
      }, {
        name: 'path',
        content: '/test.txt'
      }], {
        name: 'buffer',
        filename: 'test.txt',
        contentType: 'text/plain',
        content: 'test data'
      });

      create.success = {
        default: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: commonCreatedFilePayload
        },
        update: {
          initial: {
            headers: validHeaders,
            url: '/files',
            method: 'post',
            payload: commonCreatedFilePayload
          },
          recreate: {
            headers: validHeaders,
            url: '/files',
            method: 'post',
            payload: utils.constructMultipartPayload([{
              name: 'project_id',
              content: validProjects[0].id
            }, {
              name: 'path',
              content: '/test.txt'
            }], {
              name: 'buffer',
              filename: 'test.txt',
              contentType: 'text/plain',
              content: 'changed test data'
            })
          }
        }
      };

      create.fail = {
        projectDoesNotExist: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: 9999999
            },
            {
              name: 'path',
              content: '/test.txt'
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        },
        projectidTypeError: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: 'thisisastring'
            },
            {
              name: 'path',
              content: '/test.txt'
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        },
        pathTypeError: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: validProjects[0].id
            },
            {
              name: 'path',
              content: 1234
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        },
        payloadAbsent: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: {}
        },
        projectidAbsent: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'path',
              content: '/test.txt'
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        },
        pathAbsent: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: validProjects[0].id
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        },
        dataAbsent: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: validProjects[0].id
            },
            {
              name: 'path',
              content: '/test.txt'
            }
          ])
        },
        duplicatePath: {
          headers: validHeaders,
          url: '/files',
          method: 'post',
          payload: utils.constructMultipartPayload([
            {
              name: 'project_id',
              content: validProjects[0].id
            },
            {
              name: 'path',
              content: validFiles[0].path
            }
          ], {
            name: 'buffer',
            filename: 'test.txt',
            contentType: 'text/plain',
            content: 'test data'
          })
        }
      };

      cb(null, create);
    });
  });
};
