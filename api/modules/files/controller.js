var Boom = require('boom');
var Promise = require('bluebird');

var File = require('./model');
var Project = require('../projects/model');

module.exports = {
  getFiles: function(req, reply) {
    File.fetchAll()
    .then(function(records) {
      if(records.models.length < 1) {
        return reply(Boom.notFound());
      }

      reply(records.toJSON());
    })
    .catch(function(e) {
      reply(Boom.badRequest(e));
    });
  },
  getFile: function(req, reply) {
    File.query({
      where: {
        id: req.params.id
      }
    }).fetch()
    .then(function(record) {
      if (!record) {
        return Promise.reject('File reference does not exist.');
      }
      reply(record.toJSON());
    })
    .catch(function(e) {
      reply(Boom.notFound(e));
    });
  },
  getProjectFiles: function(req, reply) {
    Project.query({
      where: {
        id: req.params.project_id
      }
    }).fetch()
    .then(function(record) {
      if (!record) {
        return Promise.reject('Project reference does not exist.');
      }

      return File.query({
        where: {
          project_id: req.params.project_id
        }
      }).fetchAll();
    })
    .then(function(records) {
      if(records.models.length < 1) {
        return reply(Boom.notFound());
      }

      reply(records.toJSON());
    })
    .catch(function(e) {
      reply(Boom.badRequest(e));
    });
  },
  getProjectFile: function(req, reply) {
    Project.query({
      where: {
        id: req.params.project_id
      }
    }).fetch()
    .then(function(record) {
      if (!record) {
        return Promise.reject('Project reference does not exist.');
      }

      return File.query({
        where: {
          project_id: req.params.project_id,
          id: req.params.id
        }
      }).fetch();
    })
    .then(function(record) {
      if (!record || !record.id) {
        return reply(Boom.notFound());
      }

      reply(record.toJSON());
    })
    .catch(function(e) {
      reply(Boom.badRequest(e));
    });
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
    }).fetch().then(function(result) {
      if (!result) {
        return Promise.reject('File does not exist.');
      }

      return result.destroy();
    }).then(function() {
      reply().code(204);
    }).catch(function(e) {
      var msg = e.message;

      if (msg) {
        if (msg.indexOf('where "id"') !== -1) {
          return reply(Boom.badRequest('`file_id` invalid.'));
        }
      }

      reply(Boom.badRequest(e));
    });
  }
};
