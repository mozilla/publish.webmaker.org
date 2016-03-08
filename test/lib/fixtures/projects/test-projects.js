'use strict';

var db = require(`../../db`);
var projects = {};

projects.invalid = {
  id: `thisisastring`,
  title: 12345,
  username: 23241,
  isPublic: null
};

module.exports = function(cb) {
  if (projects.valid) {
    return cb(null, projects);
  }

  db.select().table(`projects`).orderBy(`id`)
    .then(rows => {
      rows.forEach(row => {
        if (row._date_created) {
          row.date_created = row._date_created.toISOString();
          delete row._date_created;
        }
        if (row._date_updated) {
          row.date_updated = row._date_updated.toISOString();
          delete row._date_updated;
        }
      });
      projects.valid = rows;
      cb(null, projects);
    })
    .catch(cb);
};
