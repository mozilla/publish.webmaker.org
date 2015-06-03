/*
 * POST /project/:username/:projectName/unpublish
 * Publishes the specified project
*/

module.exports = function(server) {
  server.route({
    method: 'POST',
    path: '/project/{username}/{projectName}/unpublish',
    handler: function(request, reply) {}
  });
};
