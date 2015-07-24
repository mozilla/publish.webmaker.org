exports.register = function api(server, options, next) {
  server.register(
    [
      {
        register: require('./modules/users/routes')
      },
      {
        register: require('./modules/projects/routes')
      },
      {
        register: require('./modules/files/routes')
      },
      {
        register: require('./modules/publishedProjects/routes')
      }
    ], function(err) {
    if ( err ) {
      return next(err);
    }
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply(JSON.stringify(
          {
            'name': 'publish.webmaker.org',
            'description': 'the teach.org publishing service for goggles and thimble',
            'routes': {
              'users': '/users',
              'projects': '/projects',
              'files': '/files'
            }
          }, null, 2)
        );
      }
    });

    next();
  });
};

exports.register.attributes = {
  name: 'publish-webmaker-api',
  version: '0.0.0'
};
