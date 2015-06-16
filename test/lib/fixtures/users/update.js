var retrieveTestUsers = require('./test-users');

var validUsers;
var invalidUser;

var update = {};

module.exports = function(cb) {
  if (update.success) {
    return cb(null, update);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    update.success = {
      default: {
        url: '/users/' + validUsers[0].id,
        method: 'put',
        payload: {
          name: 'NewUserName'
        }
      }
    };

    update.fail = {
      userDoesNotExist: {
        url: '/users/999999',
        method: 'put',
        payload: {
          name: 'NewUserName'
        }
      },
      useridTypeError: {
        url: '/users/thisisastring',
        method: 'put',
        payload: {
          name: 'NewUserName'
        }
      }
    };

    cb(null, update);
  });
}
