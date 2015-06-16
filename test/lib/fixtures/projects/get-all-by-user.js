var retrieveTestUsers = require('../users').testUsers;

var validUsers;
var invalidUser;

var getAllByUser = {};

module.exports = function(cb) {
  if (getAllByUser.success) {
    return cb(null, getAllByUser);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    getAllByUser.success = {
      default: {
        url: '/users/' + validUsers[0].id + '/projects',
        method: 'get'
      }
    };

    getAllByUser.fail = {
      userDoesNotExist: {
        url: '/users/' + 9999999 + '/projects',
        method: 'get'
      },
      invalidUserId: {
        url: '/users/' + invalidUser.id + '/projects',
        method: 'get'
      }
    };

    cb(null, getAllByUser);
  });
}
