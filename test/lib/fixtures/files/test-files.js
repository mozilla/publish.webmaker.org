var db = require('../../db');
var files = {};

files.invalid = {
  id: 00000,
  project_id: 00000,
  path: 123,
  buffer: 'yyy'
};

module.exports = function(cb) {
  if (files.valid) {
    return cb(null, files);
  }

  db.select().table('files')
    .then(function(rows) {
      files.valid = rows;
      cb(null, files);
    })
    .catch(function(e) {
      cb(e);
    });
}
