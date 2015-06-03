/*
 * GET /project/:username/:projectName
 * Returns a file tree listing for the given project
*/

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/project/{username}/{projectName}',
    handler: function(request, reply) {}
  });
};
