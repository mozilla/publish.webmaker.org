var read = require('./routes/read');

var routes = [].concat(read);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: 'publishedFiles'
};
