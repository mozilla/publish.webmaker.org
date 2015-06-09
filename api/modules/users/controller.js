const User = require('./model.js');

module.exports = {
  getUsers: function(req, reply){
    return reply(User.fetchAll());
  },
  getUser: function(req, reply){
    return reply(User.query('where', 'id', '=', req.params.id)
      .fetch());
  }
}
