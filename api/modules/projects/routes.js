'use strict';

var create = require(`./routes/create.js`);
var read = require(`./routes/read.js`);
var update = require(`./routes/update.js`);
var del = require(`./routes/delete.js`);
var publish = require(`./routes/publish`);

var routes = [].concat(create, read, update, del, publish);

exports.register = function(server, options, next) {
  server.route(
    routes
  );

  next();
};

exports.register.attributes = {
  name: `projects`
};
