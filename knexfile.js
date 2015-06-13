var path = require('path');

module.exports = {
  development: {
    client: 'pg',
    debug: process.env.DEBUG,
    connection: process.env.DATABASE_URL,
    directory: path.resolve(__dirname, '../migrations'),
    migrations: {
      tableName: 'migrations'
    }
  }
};
