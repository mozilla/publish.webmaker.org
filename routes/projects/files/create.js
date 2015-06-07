/*
 * POST /projects/:username/:projectName/files
 * Create a file with the given contents
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
    method: 'POST',
    path: '/projects/{username}/{projectName}/files',
    config: {
      validate: {
        payload: fileSchema
      }
    },
    handler: function(request, reply) {}
  });
};
