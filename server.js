require('habitat').load();

const Hapi = require('hapi');
const Hoek = require('hoek');

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');

var connection = {
  host: process.env.API_HOST,
  port: process.env.PORT
};

const server = new Hapi.Server();
server.connection(connection); 

server.register(require('./api'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering API',
      error: err
    });
    throw err;
  }

  server.start(function() {
    console.log('Server started @ ' + server.info.uri);
  });
});
