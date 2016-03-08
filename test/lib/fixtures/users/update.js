'use strict';

var retrieveTestUsers = require(`./test-users`);

var update = {};

var userToken = {
  authorization: `token TestUser`
};

module.exports = function(cb) {
  if (update.success) {
    return cb(null, update);
  }

  retrieveTestUsers((err) => {
    if (err) { return cb(err); }

    update.fail = {
      userDoesNotExist: {
        headers: userToken,
        url: `/users/999999`,
        method: `put`,
        payload: {
          name: `NewUserName`
        }
      },
      useridTypeError: {
        headers: userToken,
        url: `/users/thisisastring`,
        method: `put`,
        payload: {
          name: `NewUserName`
        }
      }
    };

    cb(null, update);
  });
};
