'use strict';

var retrieveTestFiles = require(`./test-files`);
var retrieveProjectFiles = require(`../projects`).testProjects;

var validFiles;
var updatePath = {};

var validHeaders = {
  authorization: `token ag-dubs`
};

module.exports = function(cb) {
  if (updatePath.success) {
    return cb(null, updatePath);
  }

  retrieveProjectFiles((errFiles) => {
    if (errFiles) { return cb(errFiles); }

    retrieveTestFiles((err, files) => {
      if (err) { return cb(err); }

      validFiles = files.valid;

      updatePath.success = {
        default: {
          headers: validHeaders,
          url: `/files/` + validFiles[0].id + `/path`,
          method: `put`,
          payload: {
            path: `/my/new/path`
          }
        }
      };

      updatePath.fail = {
        fileDoesNotExist: {
          headers: validHeaders,
          url: `/files/999999/path`,
          method: `put`,
          payload: {
            path: `/my/new/path`
          }
        },
        fileidTypeError: {
          headers: validHeaders,
          url: `/files/thisisastring/path`,
          method: `put`,
          payload: {
            path: `/my/new/path`
          }
        }
      };

      cb(null, updatePath);
    });
  });
};
