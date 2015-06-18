'use strict';

var dropTables = require('../migrations/1_create_users_projects_files').down;
var createTables = require('../migrations/1_create_users_projects_files').up;

exports.seed = function(knex, Promise) {
  return dropTables(knex)
    .then(function() { return createTables(knex); })

    .then(function() { return knex('users').insert({ name: 'ag-dubs' }); })
    .then(function() { return knex('users').insert({ name: 'k88hudson' }); })
    .then(function() { return knex('users').insert({ name: 'jbuckca' }); });
};
