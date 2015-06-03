/*
 * GET /projects/:username
 * Returns a listing of a given user's projects
*/

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/projects/{username}',
    handler: function(request, reply) {}
  });
};
