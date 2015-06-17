var Boom = require('boom');
var Promise = require('bluebird');
var Publisher = require('../../classes/publish');
var Project = require('./model.js'); 

module.exports = {
  getProjects: function(req, reply) {
    Project.fetchAll()
      .then(function(records) {
        reply(records.toJSON()).code(200);
      })
      .catch(function(e) {
        reply(Boom.badRequest(e));
      });
  },
  getProject: function(req, reply) {
    var q = {};
    if (req.query && req.query.include) {
      q.withRelated = [req.query.include];
    }
    Project.query({
      where: {
        id: req.params.id
      }
    }).fetch(q).then(function(model){
      reply(model.toJSON()).code(200);
    }).catch(function(e) {
      reply(Boom.badRequest(e));
    });
  },
  getUserProjects: function(req, reply) {
    Project.query({
      where: {
        user_id: req.params.user_id
      }
    }).fetchAll().then(function(records){
      if(records.models.length < 1) {
        return Promise.reject('User reference does not exist.');
      } 
      
      reply(records.toJSON()).code(200);
    }).catch(function(e) {
      reply(Boom.badRequest(e));
    });
  },
  getUserProject: function(req, reply) {
    Project.query({
      where: {
        user_id: req.params.user_id,
        id: req.params.id
      }
    }).fetch().then(function(record){
      reply(record.toJSON()).code(200);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  createProject: function(req, reply) {
    Project.forge({
      title: req.payload.title,
      user_id: req.payload.user_id,
      tags: req.payload.tags,
      description: req.payload.description,
      date_created: req.payload.date_created,
      date_updated: req.payload.date_updated
    }).save().then(function(record){
      reply(record.toJSON()).code(201);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  updateProject: function(req, reply) {
    Project.query({
      where: {
        id: req.payload.id
      }
    }).save({
      title: req.payload.title,
      user_id: req.payload.user_id,
      tags: req.payload.tags,
      description: req.payload.description,
      date_created: req.payload.date_created,
      date_updated: req.payload.date_updated
    }, {
      method: 'update',
      patch: 'true'
    }).then(function(record){
      reply(record.toJSON()).code(200);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  deleteProject: function(req, reply) {
    Project.query({
      where: {
        id: req.params.id
      }
    }).destroy().then(function(record){
      reply(record.toJSON()).code(204);
    }).catch(function(e){
      var msg = e.message;

      if (msg) {
        if (msg.indexOf('where "id"') !== -1) {
          return reply(Boom.badRequest('`project_id` invalid.'));
        }
      }

      reply(Boom.badRequest(e));
    });
  },
  publishProject: function(req, reply) {
    Project.query({
      where: {
        id: req.params.id
      }
    }).fetch().then(function(project){
      reply(Publisher.publish(project));
    });
  },
  unpublishProject: function(req, reply) {
    Project.query({
      where: {
        id: req.params.id
      }
    }).fetch().then(function(project){
      reply(Publisher.unpublish(project));
    });
  }
};
