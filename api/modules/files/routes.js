var create = require('./routes/create.js');
var read = require('./routes/read.js');
var update = require('./routes/update.js');
var updatePath = require('./routes/update-path.js');
var del = require('./routes/delete.js');

var routes = [].concat(create, read, update, updatePath, del);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: 'files'
};
