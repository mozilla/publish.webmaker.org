/*
 * GET /projects/:username/:projectName
 * Returns a project's metadata and its contents (list of files)
 * as a Project object:
 * {
 *   name: <string>,
 *   username: <string>,
 *   isPublic: <boolean>,
 *   files: <array> - list of paths(string)
 * }
 * If a query string in the form ?includeFiles=true is passed in,
 * each Project object will instead look like:
 * {
 *   name: <string>,
 *   username: <string>,
 *   isPublic: <boolean>,
 *   files: [ <FileObj1>, <FileObj2> ... ]
 * }
*/

var queryStringSchema = require('../../schemas.js').qsIncludeFiles;

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/projects/{username}/{projectName}',
    config: {
      validate: {
        query: queryStringSchema
      }
    },
    handler: function(request, reply) {}
  });
};
