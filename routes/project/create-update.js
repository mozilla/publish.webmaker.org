/*
 * PUT /project/:username/:projectName
 * Creates a new project for the given user or renames a given project
 * The optional message body that would normally be expected by this route
 * will look something like:
 * {
 *    rename: an optional parameter that indicates that this is a rename
 *            and is the new name of the project
 * }
*/

module.exports = function(server) {
  server.route({
    method: 'PUT',
    path: '/project/{username}/{projectName}',
    handler: function(request, reply) {}
  });
};
