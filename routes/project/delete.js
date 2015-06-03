/*
 * DELETE /project/:username/:projectName
 * Deletes the given project for the given user
*/

module.exports = function(server) {
  server.route({
    method: 'DELETE',
    path: '/project/{username}/{projectName}',
    handler: function(request, reply) {}
  });
};
