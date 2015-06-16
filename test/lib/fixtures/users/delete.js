var retrieveTestUsers = require('./test-users');

var validUsers;
var invalidUser;

var del = {};

module.exports = function(cb) {
  if (del.success) {
    return cb(null, del);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    del.fail = {
      userDoesNotExist: {
        url: '/users/999999',
        method: 'delete'
      },
      useridTypeError: {
        url: '/users/thisisastring',
        method: 'delete'
      }
    };

    cb(null, del);
  });
}
