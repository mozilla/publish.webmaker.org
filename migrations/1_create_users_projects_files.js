exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (t) {
      t.increments('id');
      t.text('name').notNullable().unique();
    })
    .createTable('projects', function (t) {
      t.increments('id');
      t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      t.text('title').notNullable();
      t.text('tags');
      t.text('description');
      t.timestamp('date_created').notNullable();
      t.timestamp('date_updated').notNullable();
    })
    .createTable('files', function (t) {
      t.increments('id');
      t.integer('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE');
      t.text('path').notNullable();
      t.specificType('buffer', 'bytea').notNullable();
    })
};


exports.down = function (knex) {
  return knex.schema
    .raw('DROP TABLE users CASCADE')
    .raw('DROP TABLE projects CASCADE')
    .raw('DROP TABLE files');
};
