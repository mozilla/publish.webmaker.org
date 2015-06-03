/*
 * PUT /file/:username/:projectName/:pathToFile
 * Create or replace the contents for the given file path
 * or rename a file
 * The message body that would normally be expected by this route
 * will look something like:
 * {
 *    data: contents of the file (this need not necessarily exist if
 *          this is a rename)
 *    rename: an optional parameter that indicates that this is a rename
 *            and is the new name of the file
 * }
*/

module.exports = function(server) {
  server.route({
    method: 'PUT',
    path: '/file/{username}/{projectName}/{path*}',
    handler: function(request, reply) {}
  });
};
