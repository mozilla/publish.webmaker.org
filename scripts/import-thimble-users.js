// import-thimble-projects.js
// Imports old thimble projects into a publish database
//
// execute as:
// node scripts/import-thimble-projects.js <legacyProjectConnString> <publishConnString>

'use strict';

const knex = require('knex');
const Hoek = require('hoek');
const fs = require('fs');

const legacyProjectConnString = process.argv[2];
const publishConnString = process.argv[3];

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

function checkAndAddUsers() {
  console.info('Fetching users...');
  return legacyProjectClient('users')
  .distinct('username')
  .select('username', 'email')
  .then(mapUsers);
}

function mapUsers(users) {
  return publishClient.transaction((txn) => {
    console.info(`Ensuring all ${users.length} users exist in publish database...`);
    return Promise.all(
      users.map(checkExistence)
    )
    .then(txn.commit)
    .catch(txn.rollback)
  });
}

function checkExistence(user) {
  return publishClient('users')
  .select()
  .where('name', '=', user.username)
  .then(function(result) {
    if (result.length === 0) {
      return insertPublishUser(user);
    }
    publishUserIdsByEmail[user.email] = result[0].id;
  });
}

function insertPublishUser(user) {
  return publishClient('users')
  .insert({
    name: user.username
  })
  .returning('id')
  .then(function(result) {
    publishUserIdsByEmail[user.email] = result[0];
  });
}

function writeUserMap() {
  console.info("writing publishUserIdsByEmail to userMap.json...");
  return new Promise((resolve, reject) => {
    fs.writeFile('userMap.json', JSON.stringify(publishUserIdsByEmail, null, 2), function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const publishUserIdsByEmail = {};

console.info('Beginning migration...');

checkAndAddUsers()
.then(writeUserMap)
.then(() => {
  console.log('All done!');
  process.exit(0);
})
.catch((err) => {
  console.log('Error: ', err);
  process.exit(1);
});
