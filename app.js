/* This creates a Hapi server which provides a RESTful API to allow Thimble
 * and X-Ray Goggles to create/update/delete projects to/from a persistent
 * store and also publish (make a project publicly available using the public
 * access server) a project
*/

var Server = require('hapi').Server;
var env = require('./environment.js');
var authentication = require('./authentication');
var routing = require('./routes');

// Logging
var hapiBunyan = require('hapi-bunyan');
var log = require('./logger.js');

var server = new Server();
server.connection({ port: env.get('port') });

// Start the server
server.register([
  // Set up logging
  {
    register: hapiBunyan,
    options: {
      logger: log
    }
  },
  // Configure authentication middleware
  // Order matters here (register authentication before routes)
  // because the authentication provider sets up the default authentication
  // strategy for all subsequent routes that are created
  {
    register: authentication
  },
  // Configure server end-points
  {
    register: routing
  }
], function(err) {
  if(err) {
    console.error('Failed to load required plugins');
    throw err;
  }

  server.start(function(err) {
    if(err) {
      log.fatal(err, 'Failed to start the server');
    } else {
      log.info({server: server.info}, 'Server started');
    }
  });
});
