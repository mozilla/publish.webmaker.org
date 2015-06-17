var Boom = require('boom');
var controller = require('../controller');
var schema = require('../schema');

module.exports = [{
  method: 'POST',
  path: '/projects',
  config: {
    handler: controller.createProject,
    description: 'Create a new project object.',
    validate: {
      payload: schema,
      failAction: function(request, reply, source, error) {
        var failedAttribute = '`' + error.data.details[0].path + '`';

        // Look to see if the attribute was passed at all
        if (error.data.details[0].message.indexOf('is required') !== -1) {
          return reply(Boom.badRequest(failedAttribute + ' must be passed.'))
        }

        // Otherwise the type was invalid
        reply(Boom.badRequest(failedAttribute + ' invalid'));
      }
    }
  }
}];
