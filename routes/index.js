/*
 * Set up routes for save/publish
*/

exports.register = function(server, options, next) {

  // /projects/* - Project metadata routes
  require('./projects/get-all.js')(server);
  require('./projects/get-one.js')(server);
  require('./projects/create.js')(server);
  require('./projects/update.js')(server);
  require('./projects/delete.js')(server);

  // /projects/.../files/* - File data routes
  require('./projects/files/get-one.js')(server);
  require('./projects/files/create.js')(server);
  require('./projects/files/update.js')(server);
  require('./projects/files/delete.js')(server);

  next();
};

exports.register.attributes = {
  name: 'publish-routes'
};
