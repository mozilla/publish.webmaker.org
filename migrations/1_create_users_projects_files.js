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
  return Promise.all([
    knex.schema.hasTable('users')
    .then(function(exists) {
      if (exists) {
        return knex.raw('DROP TABLE users CASCADE');
      }
    }),
    knex.schema.hasTable('projects')
    .then(function(exists) {
      if (exists) {
        return knex.raw('DROP TABLE projects CASCADE');
      }
    }),
    knex.schema.hasTable('files')
    .then(function(exists) {
      if (exists) {
        return knex.raw('DROP TABLE files CASCADE');
      }
    }),
    knex.schema.hasTable('publishedProjects')
    .then(function(exists) {
      if (exists) {
        return knex.raw('DROP TABLE "publishedProjects" CASCADE');
      }
    }),
    knex.schema.hasTable('publishedFiles')
    .then(function(exists) {
      if (exists) {
        return knex.raw('DROP TABLE "publishedFiles"');
      }
    })
  ]);
};
