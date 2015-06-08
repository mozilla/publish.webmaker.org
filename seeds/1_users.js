'use strict';

exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').del(), 

    knex('users').insert({ id: 1, name: 'ag_dubs' }),
    knex('users').insert({ id: 2, name: 'k88hudson' }),
    knex('users').insert({ id: 3, name: 'jbuckca' })
  );
};
