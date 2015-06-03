/*
 * POST /project/:username/:projectName/publish
 * Publishes the specified project
*/

module.exports = function(server) {
  server.route({
    method: 'POST',
    path: '/project/{username}/{projectName}/publish',
    handler: function(request, reply) {}
  });
};
