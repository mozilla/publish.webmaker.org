var env = require('habitat');
env.load('tests.env');

var Hapi = require('hapi');
var expect = require('code').expect;

module.exports = function(done) {
  var server = new Hapi.Server();
  server.connection();

  server.register([
    require('../../../api/modules/files/routes'),
    require('../../../api/modules/projects/routes'),
    require('../../../api/modules/users/routes')
  ], function(err) {
    expect(err).to.not.exist();

    server.start(function(err) {
      expect(err).to.not.exist();

      return done(server);
    });
  });
}
