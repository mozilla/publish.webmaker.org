var Boom = require('boom');
var Promise = require('bluebird');
var User = require('./model.js');

module.exports = {
  getUsers: function(req, reply) {
    if(req.query.name) {
      User.query({
        where: {
          name: req.query.name
        }
      }).fetch().then(function(record){
        reply(record.toJSON());
      });
    }
    User.fetchAll().then(function(records){
      reply(records.toJSON());
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  getUser: function(req, reply) {
    User.query({
      where: {
        id: req.params.id
      }
    }).fetch().then(function(record){
      reply(record.toJSON());
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  createUser: function(req, reply) {
    User.forge({
      name: req.payload.name
    }).save().then(function(record){
      reply(record.toJSON()).code(201);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  updateUser: function(req, reply) {
    User.query({
      where: {
        id: req.params.id
      }
    }).save({
      name: req.payload.name
    }, { 
      method: 'update',
      patch: 'true' 
    }).then(function(record){
      reply(record.toJSON()).code(204);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  },
  deleteUser: function(req, reply) {
    User.query({
      where: {
        id: req.params.id
      }
    }).destroy().then(function(record){
      reply(record.toJSON()).code(204);
    }).catch(function(e){
      reply(Boom.badRequest(e));
    });
  }
};
