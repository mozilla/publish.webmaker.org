// import-thimble-projects.js
// Imports old thimble projects into a publish database
//
// execute as:
// node scripts/import-thimble-projects.js <legacyProjectConnString> <publishConnString> <limit> <offset>

'use strict';

const knex = require('knex');
const Hoek = require('hoek');

const legacyProjectConnString = process.argv[2];
const publishConnString = process.argv[3];
const limit = process.argv[4] || 50000;
const offset = process.argv[5] || 0;

Hoek.assert(legacyProjectConnString, 'You must provide a connection string to a database containing legacy project data');
Hoek.assert(publishConnString, 'You must provide a connection string to a publish database');


const legacyProjectClient = knex({
  client: 'pg',
  connection: legacyProjectConnString
});

const publishClient = knex({
  client: 'pg',
  connection: publishConnString
});

const publishUserIdsByEmail = require('./userMap.json');

function migrateOldProjects() {
  console.info(`Fetching projects ${offset}-${(+offset) + (+limit)}`);
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
  .limit(limit)
  .offset(offset)
  .then(handleOldProjects);
}

function handleOldProjects(oldProjects) {
  console.info(`Migrating ${oldProjects.length} projects into publish database...`);
  return publishClient.transaction((txn) => {
    Promise.all(
      oldProjects.map(migrateProject)
    )
    .then(txn.commit)
    .catch(txn.rollback);
  });
}

function migrateProject(oldProject) {
  return createPublishProject(oldProject)
  .then(createPublishFile);
}

function createPublishProject(oldProject) {
  return publishClient('projects')
  .insert({
    title: oldProject.title,
    _date_created: new Date(oldProject.createdAt).toISOString(),
    _date_updated: new Date(oldProject.updatedAt).toISOString(),
    user_id: publishUserIdsByEmail[oldProject.email]
  })
  .returning('id')
  .then((result) => {
    return {
      publishId: result[0],
      oldProject
    }
  });
}

function createPublishFile(projectData) {
  return publishClient('files')
  .insert({
    path: '/index.html',
    project_id: projectData.publishId,
    buffer: new Buffer(projectData.oldProject.html)
  });
}

console.info('Beginning migration...');

migrateOldProjects()
.then(() => {
  console.log('All done!');
  process.exit(0);
})
.catch((err) => {
  console.log('Error: ', err);
  process.exit(1);
});