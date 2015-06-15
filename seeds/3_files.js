'use strict';

var fs = require('fs');

exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('files').insert({
      project_id: 1,
      path: 'index.js',
      buffer: fs.readFileSync(__dirname + '/file_data/index.js')
    }),
    knex('files').insert({
      project_id: 1,
      path: 'package.json',
      buffer: fs.readFileSync(__dirname + '/file_data/package.json')
    }),
    knex('files').insert({
      project_id: 1,
      path: 'public/img/sagan.jpg',
      buffer: fs.readFileSync(__dirname + '/file_data/public/img/sagan.jpg')
    }),
    knex('files').insert({
      project_id: 2,
      path: 'Gemfile',
      buffer: fs.readFileSync(__dirname + '/file_data/Gemfile')
    }),
    knex('files').insert({
      project_id: 3,
      path: 'logo.png',
      buffer: fs.readFileSync(__dirname + '/file_data/logo.png')
    }),
    knex('files').insert({
      project_id: 4,
      path: '.gitignore',
      buffer: fs.readFileSync(__dirname + '/file_data/.gitignore')
    })
  );
};
