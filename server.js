var Hapi = require('hapi');
var Hoek = require('hoek');

var log = require('./logger.js');

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');

var connection = {
  host: process.env.API_HOST,
  port: process.env.PORT
};

var server = new Hapi.Server();
server.connection(connection);

server.register([
  {
    register: require('./api')
  },
  {
    register: require('hapi-bunyan'),
    options: {
      logger: log
    }
  }], function(err) {
  server.start(function() {
    log.info({ server: server.info }, 'Server started');
  });
});
