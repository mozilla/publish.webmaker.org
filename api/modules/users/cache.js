"use strict";

const Users = require(`./model`);
const projectsQueryBuilder = require(`../projects/model`).prototype.queryBuilder();

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
    return Users.where(`name`, username)
    .fetch()
    .then(user => {
      next(null, user && user.toJSON());
    })
    .catch(next);
  }
}

class UserForProjectCache extends BaseCache {
  constructor(server) {
    super(server);
  }

  get name() {
    return `userForProject`;
  }

  get config() {
    return Object.assign(super.config, {
      expiresIn: 60 * 60 * 1000 // 1 hour, an approximation of a typical user's Thimble session for a specific project
    });
  }

  run(projectId, next) {
    return projectsQueryBuilder.getUserByProjectId(projectId)
    .then(user => next(null, user))
    .catch(next);
  }
}

module.exports = {
  UserCache,
  UserForProjectCache
};
