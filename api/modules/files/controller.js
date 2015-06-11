var File = require('./model.js');

module.exports = {
  getFiles: function(req, reply) {
    return reply(File.fetchAll());
  },
  getFile: function(req, reply) {
    return reply(File.query({
      where: {
        id: req.params.id
      }
    }).fetch());
  },
  getProjectFiles: function(req, reply) {
    return reply(File.query({
      where: {
        project_id: req.params.project_id
      }
    }).fetchAll());
  },
  getProjectFile: function(req, reply) {
    return reply(File.query({
      where: {
        project_id: req.params.project_id,
        id: req.params.id
      }
    }).fetch());
  },
  createFile: function(req, reply) {
    return reply(File.forge({
      path: req.payload.path,
      project_id: req.payload.project_id,
      buffer: req.payload.buffer
    }).save());
  },
  updateFile: function(req, reply) {
    return reply(File.query({
      where: {
        id: req.params.id
      }
    }).save({
      path: req.payload.path,
      project_id: req.payload.project_id,
      buffer: req.payload.buffer
    }, {
      method: 'update',
      patch: 'true'
    }));
  },
  deleteFile: function(req, reply) {
    return reply(File.query({
      where: {
        id: req.params.id
      }
    }).destroy());
  }
};
