/*
 * Initialize the environment for the server
*/

// LOG_LEVEL set using the process env instead of .env
// This will always take precedence over what is set in the .env
var LOG_LEVEL = process.env.LOG_LEVEL;

var Habitat = require('habitat');

if (process.env.NODE_ENV !== 'test') {
  Habitat.load('.env');
}

var defaults = {
  log_level: 'info',
  node_env: 'development'
};
var env = new Habitat('publish', defaults);

if (LOG_LEVEL) {
  env.set('LOG_LEVEL', LOG_LEVEL);
}

module.exports = env;
