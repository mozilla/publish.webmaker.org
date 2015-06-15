'use strict';

var dropTables = require('../migrations/1_create_users_projects_files').down;
var createTables = require('../migrations/1_create_users_projects_files').up;

exports.seed = function(knex, Promise) {
  return dropTables(knex)
    .then(function() { return createTables(knex); })

    .then(function() { return knex('users').insert({ id: 1, name: 'ag_dubs' }); })
    .then(function() { return knex('users').insert({ id: 2, name: 'k88hudson' }); })
    .then(function() { return knex('users').insert({ id: 3, name: 'jbuckca' }); });
};
