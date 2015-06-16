var Hapi = require('hapi');
var expect = require('code').expect;

module.exports = function(done) {
  var server = new Hapi.Server();
  server.connection();

  server.register([
    require('../../../api/modules/files/routes.js'),
    require('../../../api/modules/projects/routes.js'),
    require('../../../api/modules/users/routes.js')
  ], function(err) {
    expect(err).to.not.exist();

    server.start(function(err) {
      expect(err).to.not.exist();

      return done(server);
    });
  });
}
