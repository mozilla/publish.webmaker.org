var db = require('../../db');
var projects = {};

projects.invalid = {
  id: 'thisisastring',
  title: 12345,
  username: 23241,
  isPublic: null
};

module.exports = function(cb) {
  if (projects.valid) {
    return cb(null, projects);
  }

  db.select().table('projects').orderBy('id')
    .then(function(rows) {
      projects.valid = rows;
      cb(null, projects);
    })
    .catch(function(e) {
      cb(e);
    });
};
