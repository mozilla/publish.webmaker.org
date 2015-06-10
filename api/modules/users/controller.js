var User = require('./model.js');

module.exports = {
  getUsers: function(req, reply) {
    return reply(User.fetchAll());
  },
  getUser: function(req, reply) {
    return reply(User.query({
      where: {
        id: req.params.id
      }
    }).fetch());
  },
  createUser: function(req, reply) {
    return reply(User.forge({
      name: req.payload.name
    }).save());
  },
  updateUser: function(req, reply) {
    return reply(User.query({
      where: {
        id: req.params.id
      }
    }).save({
      name: req.payload.name
    }, { 
      method: 'update',
      patch: 'true' 
    }));
  },
  deleteUser: function(req, reply) {
    return reply(User.query({
      where: {
        id: req.params.id
      }
    }).destroy());
  }
};
