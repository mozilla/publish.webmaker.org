"use strict";

require(`../lib/environment`);

const Hoek = require(`hoek`);
const Promise = require(`bluebird`);
const inquirer = require(`inquirer`);

Hoek.assert(process.env.PUBLISH_DATABASE_URL, `Must define PUBLISH_DATABASE_URL`);
Hoek.assert(process.env.ID_DATABASE_URL, `Must define ID_DATABASE_URL`);
Hoek.assert(process.env.LOGIN_DATABASE_URL, `Must define LOGIN_DATABASE_URL`);
Hoek.assert(!process.env.S3_EMULATION, `S3_EMULATION must not be set`);
Hoek.assert(process.env.AWS_ACCESS_KEY_ID, `AWS_ACCESS_KEY_ID must be set`);
Hoek.assert(!!process.env.AWS_SECRET_ACCESS_KEY, `AWS_SECRET_ACCESS_KEY must be set`);
Hoek.assert(!!process.env.AWS_BUCKET, `AWS_BUCKET must be set`);
Hoek.assert(process.argv.length > 2, `Usage: node scripts/delete-thimble-account <email address>`);

const S3 = require(`aws-sdk/clients/s3`);
const s3 = new S3();
const PgClient = require(`pg`).Client;
const mysql = require(`mysql2/promise`);

const emailAddress = process.argv[2];
const bucket = process.env.AWS_BUCKET;
let loginDb;
const idDb = Promise.promisifyAll(new PgClient(process.env.ID_DATABASE_URL));
const publishDb = Promise.promisifyAll(new PgClient(process.env.PUBLISH_DATABASE_URL));
const steps = [
  `[1] Delete published projects from S3...`,
  `[2] Delete projects and account from the publish DB...`,
  `[3] Delete tokens from the id.webmaker.org DB...`,
  `[4] Delete user account from the wmlogin DB...`
];

process.on(`exit`, () => {
  try {
    console.log(`Shutting down the login db connection...`);
    loginDb.destroy();
    console.log(`Shutting down the publish db connection...`);
    publishDb.end();
    console.log(`Shutting down the id db connection...`);
    idDb.end();
  } catch(e) {
    console.log(`Failed to terminate cleanly with: `, e);
  }
});

let id, username;

mysql.createConnection({
  uri: process.env.LOGIN_DATABASE_URL,
  Promise: Promise
})
.then(mysqlDb => {
  loginDb = mysqlDb;

  return loginDb.query(
    `SELECT \`id\`, \`username\` FROM \`Users\` WHERE \`email\` = ?`,
    [ emailAddress ]
  );
})
.then(rows => {
  console.log(`Found the following results for ${emailAddress}:`);
  if (rows.length < 1 || rows[0].length < 1) {
    throw new Error(`Email address was not found in the database`);
  }

  const ids = [];

  rows = rows[0];

  for(const row of rows) {
    console.log(`${row.username} with the id: ${row.id}`);
    ids.push(parseInt(row.id));
  }
  console.log(`\n`);

  return inquirer.prompt([{
    type: `number`,
    name: `loginId`,
    message: `Choose an id whose user account should be deleted: `,
    validate(value) {
      if (ids.indexOf(value) > -1) {
        return true;
      }

      return `Please enter a valid id number`;
    }
  }])
  .then(answers => {
    id = parseInt(answers.loginId);
    username = rows[ids.indexOf(id)].username;

    return s3.listObjects({
      Bucket: bucket,
      Prefix: `${username}/`
    }).promise()
    .then(data => {
      if (data.Contents.length === 0) {
        console.log(`Nothing to delete on S3!`);
        return;
      }

      const params = {
        Bucket: bucket,
        Delete: {
          Objects: data.Contents.map(content => ({ Key: content.Key }))
        }
      };

      return s3.deleteObjects(params).promise();
    })
    .then(() => console.log(steps.shift()));
  });
})
.then(() => publishDb.connectAsync()
  .then(() => publishDb.queryAsync(`DELETE FROM users WHERE name=$1`, [ username ]))
  .then(() => console.log(steps.shift()))
)
.then(() => idDb.connectAsync()
  .then(() => idDb.queryAsync(`DELETE FROM access_tokens WHERE user_id=$1`, [ id ]))
  .then(() => idDb.queryAsync(`DELETE FROM auth_codes WHERE user_id=$1`, [ id ]))
  .then(() => console.log(steps.shift()))
)
.then(() => loginDb.beginTransaction()
  .then(() => loginDb.query(
      `DELETE FROM \`LoginTokens\` WHERE \`UserId\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.query(
      `DELETE FROM \`OAuthLogins\` WHERE \`UserId\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.query(
      `DELETE FROM \`Passwords\` WHERE \`UserId\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.query(
      `DELETE FROM \`ReferrerCodes\` WHERE \`UserId\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.query(
      `DELETE FROM \`ResetCodes\` WHERE \`UserId\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.query(
      `DELETE FROM \`Users\` WHERE \`id\` = ?`,
      [ id ]
    )
  )
  .then(() => loginDb.commit())
  .then(() => console.log(steps.shift()))
  .catch(e => loginDb.rollback()
    .then(() => {
      throw e;
    })
  )
)
.then(() => {
  console.log(`Finished deleting the user account!!!`);
  process.exit(0);
})
.catch(e => {
  console.error(`Failed with: `, e);
  console.log(`We weren't able to complete the following steps:`);

  for (const step of steps) {
    console.log(step);
  }
  process.exit(1);
});
