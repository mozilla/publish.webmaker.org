var controller = require('./controller');

exports.register = function(server, options, next) {
  server.route([{
    method: 'GET',
    path: '/users',
    config: {
      handler: controller.getUsers
    }
  }, {
    method: 'GET',
    path: '/users/{id}',
    config: {
      handler: controller.getUser
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'users'
};
