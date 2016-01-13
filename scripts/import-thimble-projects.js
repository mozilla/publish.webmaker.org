// import-thimble-projects.js
// Imports old thimble projects into a publish database
//
// DETAILED MIGRATION INSTRUCTIONS: https://gist.github.com/cadecairos/44e3d34845d0f438779a#file-thimblemigration-md
//
// execute as:
// node scripts/import-thimble-projects.js <legacyProjectConnString> <publishConnString>

'use strict';

const knex = require('knex');
const Hoek = require('hoek');

const legacyProjectConnString = process.argv[2];
const publishConnString = process.argv[3];

Hoek.assert(legacyProjectConnString, 'You must provide a connection string to a database containing legacy project data');
Hoek.assert(publishConnString, 'You must provide a connection string to a publish database');

var legacyProjectClient = knex({
  client: 'pg',
  connection: legacyProjectConnString
});

var publishClient = knex({
  client: 'pg',
  connection: publishConnString
});

var publishUserIdsByEmail = {};

checkAndAddUsers()
.then(migrateOldProjects)
.then(() => {
  console.log('All done!');
  process.exit(0);
})
.catch((err) => {
  console.log('Error: ', err);
  process.exit(1);
});

function checkAndAddUsers() {
  return legacyProjectClient('users')
  .distinct('username')
  .select('username', 'email')
  .then(mapUsers);
}

function mapUsers(users) {
  return publishClient.transaction((txn) => {
    return Promise.all(
      users.map(checkExistence, txn)
    )
    .then(txn.commit)
    .catch(txn.rollback);
  });
}

function checkExistence(user) {
  return publishClient('users')
  var txn = this;
  .select()
  .where('name', '=', user.username)
  .transacting(txn)
  .then(function(result) {
    if (result.length === 0) {
      return insertPublishUser(user, txn);
    }
    publishUserIdsByEmail[user.email] = result[0].id;
  });
}

function insertPublishUser(user, txn) {
  return publishClient('users')
  .insert({
    name: user.username
  })
  .returning('id')
  .transacting(txn)
  .then(function(result) {
    publishUserIdsByEmail[user.email] = result[0];
  });
}

function migrateOldProjects(oldProjects) {
  return legacyProjectClient('projects')
  .join('users', 'users.email', '=', 'projects.email')
  .select(
    'projects.html',
    'projects.email',
    'projects.title',
    'projects.createdAt',
    'projects.updatedAt',
    'users.id',
    'users.username'
  )
  .then(handleOldProjects);
}

function handleOldProjects(oldProjects) {
  return publishClient.transaction((txn) => {
    Promise.all(
      oldProjects.map(migrateProject, txn)
    )
    .then(txn.commit)
    .catch(txn.rollback);
  });
}

function migrateProject(oldProject) {
  // this === txn
  return createPublishProject(oldProject, this)
  .then((projectData) => {
    createPublishFile(projectData, this);
  });
}

function createPublishProject(oldProject, txn) {
  return publishClient('projects')
  .insert({
    title: oldProject.title,
    date_created: new Date(oldProject.createdAt).toISOString(),
    date_updated: new Date(oldProject.updatedAt).toISOString(),
    user_id: publishUserIdsByEmail[oldProject.email]
  })
  .returning('id')
  .transacting(txn)
  .then((result) => {
    return {
      publishId: result[0],
      oldProject
    }
  });
}

function createPublishFile(projectData, txn) {
  return publishClient('files')
  .insert({
    path: '/index.html',
    project_id: projectData.publishId,
    buffer: new Buffer(projectData.oldProject.html)
  })
  .transacting(txn);
}
