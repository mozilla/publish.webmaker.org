var Boom = require('boom');

module.exports.attrs =  function(request, reply, source, error) {
  var failedAttribute = '`' + error.data.details[0].path + '`';

  // Look to see if the attribute was passed at all
  if (error.data.details[0].message.indexOf('is required') !== -1) {
    return reply(Boom.badRequest(failedAttribute + ' must be passed.')).code(400);
  }

  // Otherwise the type was invalid
  return reply(Boom.badRequest(failedAttribute + ' invalid')).code(400);
};
