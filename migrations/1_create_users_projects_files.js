var Promise = require('bluebird');

exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('publishedProjects', function(t) {
      t.increments('id');
      t.text('title').notNullable();
      t.text('tags');
      t.text('description');
    }),
    knex.schema.createTable('users', function (t) {
      t.increments('id');
      t.text('name').notNullable().unique();
    }),
    knex.schema.createTable('projects', function (t) {
      t.increments('id');
      t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      t.integer('published_id').references('id').inTable('publishedProjects');
      t.text('title').notNullable();
      t.text('tags');
      t.text('description');
      t.text('publish_url');
      t.text('date_created').notNullable();
      t.text('date_updated').notNullable();
    }),
    knex.schema.createTable('files', function (t) {
      t.increments('id');
      t.integer('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE');
      t.text('path').notNullable();
      t.specificType('buffer', 'bytea').notNullable();
    }),
    knex.schema.createTable('publishedFiles', function(t) {
      t.increments('id');
      t.integer('published_id').notNullable().references('id').inTable('publishedProjects').onDelete('CASCADE');
      t.integer('file_id').references('id').inTable('files');
      t.text('path').notNullable();
      t.specificType('buffer', 'bytea').notNullable();
    })
  ]);
};


exports.down = function (knex) {
  // We don't allow the reverse operation, as that could lead to
  // accidentally migrating to an "empty database". If users want
  // to fully wipe their database, this must be done manually.
  return Promise.resolve();
};
