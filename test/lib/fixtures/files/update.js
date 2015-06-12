var retrieveTestFiles = require('./test-files');

var validFiles;
var invalidFile;

var update = {};

module.exports = function(cb) {
  if (update.success) {
    return cb(null, update);
  }

  retrieveTestFiles(function(err, files) {
    if (err) return cb(err);

    validFiles = files.valid;
    invalidFile = files.invalid;

    update.success = {
      default: {
        url: '/files/' + validFiles[0].id,
        method: 'put',
        payload: {
          path: '/test.txt',
          data: new Buffer('text')
        }
      }
    };

    update.fail = {
      fileDoesNotExist: {
        url: '/files/999999',
        method: 'put'
      },
      fileidTypeError: {
        url: '/files/thisisastring',
        method: 'put'
      }
    };

    cb(null, update);
  });
}
