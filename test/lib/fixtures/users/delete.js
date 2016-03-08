'use strict';

var retrieveTestUsers = require(`./test-users`);

var del = {};

var userToken = {
  authorization: `token TestUser`
};

module.exports = function(cb) {
  if (del.success) {
    return cb(null, del);
  }

  retrieveTestUsers((err) => {
    if (err) { return cb(err); }

    del.fail = {
      userDoesNotExist: {
        headers: userToken,
        url: `/users/999999`,
        method: `delete`
      },
      useridTypeError: {
        headers: userToken,
        url: `/users/thisisastring`,
        method: `delete`
      }
    };

    cb(null, del);
  });
};
