var create = require('./routes/create');
var read = require('./routes/read');
var update = require('./routes/update');
var del = require('./routes/delete');
var publish = require('./routes/publish');

var routes = [].concat(create, read, update, del, publish);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: 'projects'
};
