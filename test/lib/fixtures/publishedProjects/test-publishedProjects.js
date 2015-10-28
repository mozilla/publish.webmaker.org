var db = require('../../db');
var publishedProjects = {};

publishedProjects.invalid = {
  id: 'thisisastring',
  title: 12345,
  date_created: 12345,
  date_updated: 12345
};

module.exports = function(callback) {
  if (publishedProjects.valid) {
    return callback(null, publishedProjects);
  }

  db.select().table('publishedProjects')
  .then(function(rows) {
    publishedProjects.valid = rows;
    callback(null, publishedProjects);
  })
  .catch(callback);
};
