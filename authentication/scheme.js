/*
 * Authentication scheme used to authenticate requests to publish.webmaker.org
*/

var Boom = require('boom');

module.exports = function(server, options) {
  return {
    authenticate: function(request, reply) {
      // Logic to authenticate a request goes in here once we
      // decide on a strategy to authenticate requests between
      // thimble/goggles and publish.wm.org

      // failure
      // return reply(Boom.error);

      // success
      // return reply.continue({auth data if any});
    }
  };
};
