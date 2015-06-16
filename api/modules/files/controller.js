var Boom = require('boom');
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
    File.query({
      where: {
        path: req.payload.path,
        project_id: req.payload.project_id,
      }
    }).fetch()
    .then(function(results) {
      if (!results) {
        return File.forge({
          path: req.payload.path,
          project_id: req.payload.project_id,
          buffer: req.payload.buffer
        })
        .save()
        .then(function(model) {
          reply(model.toJSON())
            .code(201);
        })
      }

      reply(Boom.badRequest('`path` must be unique within a project.'))
    })
    .catch(function(error) {
      var msg = error.message;

      if (msg) {
        if (msg.indexOf('violates foreign key') !== -1) {
          return reply(Boom.badRequest('Associated project does not exist.'));
        }
        if (msg.indexOf('"project_id" must be a number' !== -1)) {
          return reply(Boom.badRequest('`project_id` invalid'))
        }
      }

      reply(Boom.badRequest(error));
    });
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
    File.query({
      where: {
        id: req.params.id
      }
    }).destroy().then(function() {
      reply().code(204);
    }).catch(function(e) {
      reply(Boom.badImplementation(e));
    });
  }
};
