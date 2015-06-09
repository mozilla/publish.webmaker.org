/*
 * Wrapper for logging server messages at different log levels
*/

var bunyan = require('bunyan');
var PrettyStream;

var env = require('../environment.js');
var LOG_LEVEL = env.get('log_level');
var NODE_ENV = env.get('node_env');

// In development, we pretty print the JSON logging to stdout.
var stream;
if(NODE_ENV === 'development') {
  PrettyStream = require('bunyan-prettystream');
  stream = new PrettyStream();
  stream.pipe(process.stdout);
} else {
  stream = process.stdout;
}

module.exports = bunyan.createLogger({
  name: 'publish.webmaker.org',
  level: LOG_LEVEL,
  stream: stream
});
