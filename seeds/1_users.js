'use strict';

// FIXME: TODO: We may want to make these user accounts less
//              "real people" and more "generic developer"

exports.seed = function(knex, Promise) {
  var users = [
    { name: 'ag_dubs' },
    { name: 'k88hudson' },
    { name: 'jbuckca' },
    { name: 'pomax' },
  ];

  return Promise.join(
    knex.insert(users[0]).into('users').catch(function() { return knex.table('users'); }),
    knex.insert(users[1]).into('users').catch(function() { return knex.table('users'); }),
    knex.insert(users[2]).into('users').catch(function() { return knex.table('users'); }),
    knex.insert(users[3]).into('users').catch(function() { return knex.table('users'); })
  );
};
