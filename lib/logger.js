/*
 * Wrapper for logging server messages at different log levels
*/

var Hoek         = require('hoek');
var bunyan       = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

Hoek.assert(process.env.LOG_LEVEL, 'Must define LOG_LEVEL');

var stream = new PrettyStream();
stream.pipe(process.stdout);

module.exports = bunyan.createLogger({
  name: 'publish.webmaker.org',
  level: process.env.LOG_LEVEL,
  stream: stream
});
