/*
 * DELETE /projects/:username/:projectName
 * Deletes the given project for the given user including all associated
 * project files
*/

module.exports = function(server) {
  server.route({
    method: 'DELETE',
    path: '/projects/{username}/{projectName}',
    handler: function(request, reply) {}
  });
};
