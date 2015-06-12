var retrieveTestFiles = require('../files/test-files');

var validFiles;
var invalidFile;

var getOne = {};

module.exports = function(cb) {
  if (getOne.success) {
    return cb(null, getOne);
  }

  retrieveTestFiles(function(err, files) {
    if (err) return cb(err);

    validFiles = files.valid;
    invalidFile = files.invalid;

    getOne.success = {
      default: {
        url: '/files/' + validFiles[0].id,
        method: 'get'
      }
    };

    getOne.fail = {
      invalidFileid: {
        url: '/files/' + invalidFile.id,
        method: 'get'
      },
      fileDoesNotExist: {
        url: '/files/' + 9999999,
        method: 'get'
      }
    };

    cb(null, getOne);
  });
}
