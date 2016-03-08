'use strict';

// Initialize the environment before anything else happens
require(`./lib/environment`);

require(`newrelic`);

var Hapi = require(`hapi`);
var Hoek = require(`hoek`);

Hoek.assert(process.env.API_HOST, `Must define API_HOST`);
Hoek.assert(process.env.PORT, `Must define PORT`);

var extensions = require(`./adaptors/extensions`);

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  }
});

var connection = {
  host: process.env.API_HOST,
  port: process.env.PORT
};

server.connection(connection);

server.register({
  register: require(`hapi-bunyan`),
  options: {
    logger: require(`./lib/logger`),
    handler: function(eventType) {
      // In almost every situation we log to bunyan directly
      // through `req.log[level](...)` which doesn't trigger
      // a HAPI log event. When a HAPI log event is triggered,
      // this function determines if the data should be passed to
      // bunyan to be displayed.

      // Allow HAPI server-level logs (vs HAPI request-level logs)
      if (eventType === `log`) {
        // Returning false says "log this as normal"
        return false;
      }
      return true;
    }
  }
}, (err) => {
  Hoek.assert(!err, err);
});

server.register(require(`./adaptors/plugins`), (err) => {
  if (err) {
    server.log(`error`, {
      message: `Error registering plugins`,
      error: err
    });
    throw err;
  }

  server.auth.strategy(
    `token`,
    `bearer-access-token`,
    true,
    require(`./lib/auth-config`)(require(`./lib/tokenValidator`))
  );
});

server.register({ register: require(`./api`) }, (errApi) => {
  if (errApi) {
    server.log(`error`, {
      message: `Error registering api`,
      error: errApi
    });
    throw errApi;
  }

  // Server extension hooks
  server.ext(`onPreResponse`, [extensions.logRequest, extensions.clearTemporaryFile]);

  server.start((err) => {
    if (err) {
      server.log(`error`, {
        message: `Error starting server`,
        error: err
      });
      throw err;
    }

    server.log(`info`, { server: server.info }, `Server started`);
  });
});
