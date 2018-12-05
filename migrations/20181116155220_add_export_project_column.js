'use strict';

exports.up = function(knex, Promise) {
  return Promise.join(
    knex.schema.table('projects', function (t) {
      t.boolean('glitch_migrated')
      .defaultTo(false)
      .notNullable();
    })
  );
};

exports.down = function(knex, Promise) {
  // Irreversible, you cannot re-create the column with the original data
  return Promise.resolve();
};
