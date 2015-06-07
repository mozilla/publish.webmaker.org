/*
 * GET /projects/:username
 * Returns a list of projects belonging to a user in the format:
 * {
 *   projects: [ <ProjectObj1>, <ProjectObj2>... ]
 * }
 * Each ProjectObj looks like:
 * {
 *   name: <string>,
 *   username: <string>,
 *   isPublic: <boolean>,
 *   files: <array> - list of paths(string)
 * }
*/

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/projects/{username}',
    handler: function(request, reply) {}
  });
};
