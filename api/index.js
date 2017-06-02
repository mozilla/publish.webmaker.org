"use strict";

const Hoek = require(`hoek`);

exports.register = function api(server, options, next) {
  if (server.app.cacheEnabled) {
    const catbox = server.root._caches._default.client;

    Hoek.assert(catbox && typeof catbox === `object`, `Can't find catbox cache client`);

    const catboxEngine = catbox.connection;

    Hoek.assert(catboxEngine && typeof catboxEngine === `object`, `Can't find catbox engine`);
    Hoek.assert(typeof catboxEngine.isReady === `function`, `Catbox engine doesn't have a ready function`);
  }

  // Add each module's cache functions to the global server methods
  [
    require(`./modules/users/cache`),
    require(`./modules/files/cache`)
  ].forEach(module => {
    Object.keys(module).forEach(CacheClassKey => {
      const cache = new module[CacheClassKey](server);
      let cacheConfig;

      if (server.app.cacheEnabled && cache.config) {
        cacheConfig = {
          cache: cache.config
        };

        if (cache.generateKey) {
          cacheConfig.generateKey = cache.generateKey;
        }
      }

      server.method(cache.name, cache.run.bind(cache), cacheConfig);
    });
  });

  server.register([{
    register: require(`./modules/users/routes`)
  }, {
    register: require(`./modules/projects/routes`)
  }, {
    register: require(`./modules/files/routes`)
  }, {
    register: require(`./modules/publishedProjects/routes`)
  }, {
    register: require(`./modules/publishedFiles/routes`)
  }], function(err) {
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
