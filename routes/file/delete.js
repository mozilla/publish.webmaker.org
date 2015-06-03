/*
 * DELETE /file/:username/:projectName/:pathToFile
 * Deletes the given file
*/

module.exports = function(server) {
  server.route({
    method: 'DELETE',
    path: '/file/{username}/{projectName}/{path*}',
    handler: function(request, reply) {}
  });
};
