/*
 * DELETE /projects/:username/:projectName/files/:pathToFile
 * The :pathToFile parameter must be URI encoded
 * Deletes the given file
*/

module.exports = function(server) {
  server.route({
    method: 'DELETE',
    path: '/projects/{username}/{projectName}/files/{path}',
    handler: function(request, reply) {}
  });
};
