exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (t) {
      t.increments('id');
      t.text('name').notNullable().unique();
    })
    .createTable('projects', function (t) {
      t.increments('id');
      t.integer('user_id').notNullable().references('id').inTable('users');
      t.text('title').notNullable();
      t.text('tags');
      t.text('description');
      t.text('publish_url');
      t.timestamp('date_created').notNullable();
      t.timestamp('date_updated').notNullable();
    })
    .createTable('files', function (t) {
      t.increments('id');
      t.integer('project_id').notNullable().references('id').inTable('projects');
      t.text('path').notNullable();
      t.specificType('buffer', 'bytea').notNullable();
    });
};


exports.down = function (knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('projects')
    .dropTable('files');
};
