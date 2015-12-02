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

  db.select().table('publishedProjects').orderBy('id')
  .then(function(rows) {
    rows.forEach(function(row) {
      if (row._date_created) {
        row.date_created = row._date_created.toISOString();
        delete row._date_created;
      }
      if (row._date_updated) {
        row.date_updated = row._date_updated.toISOString();
        delete row._date_updated;
      }
    });
    publishedProjects.valid = rows;
    callback(null, publishedProjects);
  })
  .catch(callback);
};
