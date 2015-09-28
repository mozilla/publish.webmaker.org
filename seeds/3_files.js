'use strict';

var fs = require('fs');

exports.seed = function(knex, Promise) {
  // There is no insertIfNotExists, so we insert and simply catch the error that might
  // get generated if there is a record for the file already.
  return Promise.join(
    knex('files').insert({
      project_id: 1,
      path: '/spacecats-API/index.js',
      buffer: fs.readFileSync(__dirname + '/file_data/index.js')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 1,
      path: '/spacecats-API/package.json',
      buffer: fs.readFileSync(__dirname + '/file_data/package.json')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 1,
      path: '/spacecats-API/index.html',
      buffer: fs.readFileSync(__dirname + '/file_data/index.html')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 1,
      path: '/spacecats-API/public/img/sagan.jpg',
      buffer: fs.readFileSync(__dirname + '/file_data/public/img/sagan.jpg')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 2,
      path: '/sinatra-contrib/Gemfile',
      buffer: fs.readFileSync(__dirname + '/file_data/Gemfile')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 2,
      path: '/sinatra-contrib/main.html',
      buffer: fs.readFileSync(__dirname + '/file_data/main.html')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 3,
      path: '/webmaker-android/logo.png',
      buffer: fs.readFileSync(__dirname + '/file_data/logo.png')
    }).catch(function() { return knex.table('files'); }),
    knex('files').insert({
      project_id: 4,
      path: '/makedrive/.gitignore',
      buffer: fs.readFileSync(__dirname + '/file_data/.gitignore')
    }).catch(function() { return knex.table('files'); })
  );
};
