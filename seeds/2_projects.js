'use strict';

exports.seed = function(knex, Promise) {
    return Promise.join(
        knex('projects').del(), 

        knex('projects').insert({
          user_id: 1,
          title: 'spacecats-API'
        }),
        knex('projects').insert({
          user_id: 1,
          title: 'sinatra-contrib'
        }),
        knex('projects').insert({
          user_id: 2,
          title: 'webmaker-android'
        }),
        knex('projects').insert({
          user_id: 3,
          title: 'makedrive'
        })
    );
};
