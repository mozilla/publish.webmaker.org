/*
 * GET /file/:username/:projectName/:pathToFile
 * Returns the contents of the given file
*/

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/file/{username}/{projectName}/{path*}',
    handler: function(request, reply) {}
  });
};
