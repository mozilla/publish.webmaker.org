var db = require('../../db');
var files = {};

files.invalid = {
  id: 'thisisastring',
  project_id: 'thisisastring',
  path: 123,
  buffer: 'thisisastring'
};

module.exports = function(cb) {
  if (files.valid) {
    return cb(null, files);
  }

  db.select().table('files').orderBy('id')
    .then(function(rows) {
      files.valid = rows;
      cb(null, files);
    })
    .catch(function(e) {
      cb(e);
    });
};
