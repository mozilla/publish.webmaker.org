var remix = require('./routes/remix');

var routes = [].concat(remix);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: 'publishedProjects'
};
