const Project = require('./model.js');

module.exports = {
  getProjects: function(req, reply) {
    return reply(Project.fetchAll());
  },
  getProject: function(req, reply) {
    return reply(Project.query('where', 'id', '=', req.params.id)
      .fetch());
  }
}
