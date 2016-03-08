'use strict';

var read = require(`./routes/read`);
var remix = require(`./routes/remix`);

var routes = [].concat(read, remix);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: `publishedProjects`
};
