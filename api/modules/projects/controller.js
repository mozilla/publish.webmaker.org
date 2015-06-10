var Project = require('./model.js');

module.exports = {
  getProjects: function(req, reply) {
    return reply(Project.fetchAll());
  },
  getProject: function(req, reply) {
    return reply(Project.query({
      where: {
        id: req.params.id
      }
    }).fetch());
  },
  getUserProjects: function(req, reply) {
    return reply(Project.query({
      where: {
        user_id: req.params.user_id
      }
    }).fetchAll());
  },
  getUserProject: function(req, reply) {
    return reply(Project.query({
      where: {
        user_id: req.params.user_id,
        id: req.params.id
      }
    }).fetch());
  }
};
