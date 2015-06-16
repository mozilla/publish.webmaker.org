var retrieveTestUsers = require('./test-users');

var validUsers;
var invalidUser;

var getOne = {};

module.exports = function(cb) {
  if (getOne.success) {
    return cb(null, getOne);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    getOne.success = {
      default: {
        url: '/users/' + validUsers[0].id,
        method: 'get'
      }
    };

    getOne.fail = {
      invalidFileid: {
        url: '/users/' + invalidUser.id,
        method: 'get'
      },
      fileDoesNotExist: {
        url: '/users/' + 9999999,
        method: 'get'
      }
    };

    cb(null, getOne);
  });
}
