/*
 * PUT /projects/:username/:projectName
 * Creates a new project for the given user. A project object is sent in
 * the form:
 * {
 *   name: <string> required,
 *   username: <string> required,
 *   isPublic: <boolean> required
 * }
*/

var projectSchema = require('../../schemas.js').project;

module.exports = function(server) {
  server.route({
    method: 'PUT',
    path: '/projects/{username}/{projectName}',
    config: {
      validate: {
        payload: projectSchema
      }
    },
    handler: function(request, reply) {}
  });
};
