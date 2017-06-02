"use strict";

const Users = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

class UserCache extends BaseCache {
  constructor(cache) {
    super(cache);
  }

  get name() {
    return `user`;
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
