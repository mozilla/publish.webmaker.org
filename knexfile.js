var path = require('path');

// Check if the server already loaded the env variables
if (!process.env.NODE_ENV) {
  require('habitat').load(".env");
}

module.exports = {
  development: {
    client: 'pg',
    debug: process.env.DEBUG == true,
    connection: process.env.DATABASE_URL,
    directory: path.resolve(__dirname, '../migrations'),
    migrations: {
      tableName: 'migrations'
    }
  }
};
