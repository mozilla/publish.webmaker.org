/*
 * GET /projects/:username/:projectName/files/:pathToFile
 * The :pathToFile parameter must be URI encoded
 * Returns the contents of the given file in the form:
 * {
 *   path: <string>,
 *   size: <integer>,
 *   data: <buffer>
 * }
*/

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/projects/{username}/{projectName}/files/{path}',
    handler: function(request, reply) {}
  });
};
