"use strict";

const read = require(`./routes/read`);
const remix = require(`./routes/remix`);
const exportPublishedProject = require(`./routes/export`);

const routes = [].concat(read, remix, exportPublishedProject);

exports.register = function(server, options, next) {
  server.route(routes);

  next();
};

exports.register.attributes = {
  name: `publishedProjects`
};
