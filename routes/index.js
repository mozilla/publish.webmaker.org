/*
 * Set up routes for save/publish
*/

exports.register = function(server, options, next) {

  // /projects API route
  // Handles user-level operations
  require('./projects/get-projects.js')(server);

  // /project/* API routes
  // Handles project-level operations
  require('./project/get-contents.js')(server);
  require('./project/create-update.js')(server);
  require('./project/delete.js')(server);
  require('./project/rename.js')(server);
  require('./project/publish.js')(server);
  require('./project/unpublish.js')(server);

  // /file/* API routes
  // Handles project-specific file-level operations
  require('./file/get-contents.js')(server);
  require('./file/create-update.js')(server);
  require('./file/delete.js')(server);
  require('./file/rename.js')(server);

  next();
};

exports.register.attributes = {
  name: 'publish-routes'
};
