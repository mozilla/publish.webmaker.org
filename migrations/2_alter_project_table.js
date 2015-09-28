var Promise = require('bluebird');

exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('projects', function (t) {
      t.boolean('readonly');
      t.text('client');
    })
  ]);
};

exports.down = function (knex) {
  // Note that this is irreversible, and will lead to data loss.
  return Promise.all([
    knex.schema.table('projects', function (t) {
      t.dropColumn('readonly');
      t.dropColumn('client');
    })
  ]);
};
