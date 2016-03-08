'use strict';

var create = require(`./routes/create`);
var read = require(`./routes/read`);
var update = require(`./routes/update`);
var del = require(`./routes/delete`);
var login = require(`./routes/login`);

var routes = [].concat(create, read, update, del, login);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: `users`
};
