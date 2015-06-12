/*
 * Wrapper for logging server messages at different log levels
*/

var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var stream = new PrettyStream();
stream.pipe(process.stdout);

var env = require('./environment.js');
var LOG_LEVEL = env.get('log_level');

module.exports = bunyan.createLogger({
  name: 'publish.webmaker.org',
  level: LOG_LEVEL,
  stream: stream
});
