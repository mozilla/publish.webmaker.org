"use strict";

exports.register = function api(server, options, next) {
  // Add each module's cache functions to the global server methods
  [
    require(`./modules/users/cache`)
  ].forEach(module => {
    Object.keys(module).forEach(CacheClassKey => {
      const Cache = module[CacheClassKey];
      let cacheConfig;

      if (process.env.REDIS_URL) {
        cacheConfig = {
          cache: Cache.config
        };
      }

      server.method(Cache.name, Cache.run, cacheConfig);
    });
  });

  server.register(
    [
      {
        register: require(`./modules/users/routes`)
      },
      {
        register: require(`./modules/projects/routes`)
      },
      {
        register: require(`./modules/files/routes`)
      },
      {
        register: require(`./modules/publishedProjects/routes`)
      },
      {
        register: require(`./modules/publishedFiles/routes`)
      }
    ], function(err) {
    if (err) {
      return next(err);
    }

    server.route([{
      method: `GET`,
      path: `/`,
      config: {
        auth: false
      },
      handler(request, reply) {
        return reply(request.generateResponse({
          name: `publish.webmaker.org`,
          description: `the publishing service for the Mozilla Leadership Network`,
          routes: {
            users: `/users`,
            projects: `/projects`,
            files: `/files`,
            publishedProjects: `/publishedProjects`,
            publishedFiles: `/publishedFiles`
          }
        })
        .code(200));
      }
    }, {
      method: `GET`,
      path: `/healthcheck`,
      config: {
        auth: false
      },
      handler(request, reply) {
        return reply(request.generateResponse({
          http: `okay`
        })
        .code(200));
      }
    }]);

    next();
  });
};

exports.register.attributes = {
  name: `publish-webmaker-api`,
  version: `0.0.0`
};
