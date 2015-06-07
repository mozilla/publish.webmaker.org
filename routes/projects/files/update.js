/*
 * PUT /projects/:username/:projectName/files/:pathToFile
 * The :pathToFile parameter must be URI encoded
 * Replace the contents for the given file path
 * The message body that would normally be expected by this route
 * will look something like:
 * {
 *   path: <string> required,
 *   data: <buffer> required
 * }
*/

var fileSchema = require('../../../schemas.js').file;

module.exports = function(server) {
  server.route({
    method: 'PUT',
    path: '/projects/{username}/{projectName}/files/{path}',
    config: {
      validate: {
        payload: fileSchema
      }
    },
    handler: function(request, reply) {}
  });
};
