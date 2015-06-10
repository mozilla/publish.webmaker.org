var db = require('../../db');
var users = {};

users.invalid = {
  id: '9191',
  username: 1919
};

module.exports = function(cb) {
  if (users.valid) {
    return cb(null, users);
  }

  db.select().from('users')
    .then(function(rows) {
      users.valid = rows;
      cb(null, users);
    })
    .catch(function(e) {
      cb(e);
    });
}
