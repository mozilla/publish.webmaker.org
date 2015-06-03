/*
 * Authentication module to authenticate requests sent by Thimble and X-Ray
 * Goggles to the publish.webmaker.org server
*/

var publishAuthScheme = require('./scheme.js');

exports.register = function(server, options, next) {
  server.auth.scheme('publish-webmaker', publishAuthScheme);
  server.auth.strategy('publish-webmaker-impl', 'publish-webmaker', true);
  next();
};

exports.register.attributes = {
  name: 'publish-auth'
};
