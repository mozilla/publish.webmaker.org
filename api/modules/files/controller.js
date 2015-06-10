var File = require('./model.js');

module.exports = {
  getFiles: function(req, reply) {
    return reply(File.fetchAll());
  },
  getFile: function(req, reply) {
    return reply(File.query('where', 'id', '=', req.params.id)
      .fetch());
  }
};
