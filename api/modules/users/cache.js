"use strict";

const Users = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

class UserCache extends BaseCache {
  constructor(server) {
    super(server);
  }

  get name() {
    return `user`;
  }

  get config() {
    return Object.assign(super.config, {
      expiresIn: 60 * 60 * 1000 // 1 hour, an approximation of a typical user's Thimble session
    });
  }

  run(username, next) {
    return Users.query({
      where: {
        name: username
      }
    })
    .fetch()
    .then(user => {
      next(null, user && user.toJSON());
    })
    .catch(next);
  }
}

module.exports = {
  UserCache
};
