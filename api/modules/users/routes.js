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
  }, {
    method: 'POST',
    path: '/users',
    config: {
      handler: controller.createUser
    }
  }, {
    method: 'PUT',
    path: '/users/{id}',
    config: {
      handler: controller.updateUser
    }
  }, {
    method: 'DELETE',
    path: '/users/{id}',
    config: {
      handler: controller.deleteUser
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'users'
};
