"use strict";

const BaseModel = require(`../../classes/base_model`);
const UsersModel = require(`../users/model`);

const DateTracker = require(`../../../lib/utils`).DateTracker;

class ProjectsQueryBuilder {
  constructor(context, usersTable) {
    this.context = context;
    this.ProjectsModel = context.constructor;
    this.usersTable = usersTable;
  }

  getOne(id) {
    return new this.ProjectsModel()
    .query()
    .where(this.context.column(`id`), id)
    .then(projects => this.context.parse(projects[0]));
  }

  updateOne(id, updatedValues) {
    return new this.ProjectsModel()
    .query()
    .where(this.context.column(`id`), id)
    .update(this.context.format(updatedValues))
    .then(function() { return id; });
  }

  getUserByProjectId(id) {
    return new this.ProjectsModel()
    .query()
    .innerJoin(
      this.usersTable.tableName,
      this.context.column(`user_id`),
      this.usersTable.column(`id`)
    )
    .where(this.context.column(`id`), id)
    .select(
      this.context.column(`id`, `project_id`),
      this.usersTable.column(`id`),
      this.usersTable.column(`name`)
    )
    .then(function(projectWithUser) {
      if (!projectWithUser || projectWithUser.length < 1) {
        return;
      }

      const user = projectWithUser[0];

      delete user.project_id;

      return user;
    });
  }
}

const instanceProps = {
  tableName: `projects`,
  user() {
    // We require in the function as opposed to adding a top-level require
    // to resolve the circular dependencies between models
    return this.belongsTo(require(`../users/model`));
  },
  files() {
    // We require in the function as opposed to adding a top-level require
    // to resolve the circular dependencies between models
    return this.hasMany(require(`../files/model`));
  },
  publishedProject() {
    // We require in the function as opposed to adding a top-level require
    // to resolve the circular dependencies between models
    return this.belongsTo(require(`../publishedProjects/model`), `published_id`);
  },
  format: DateTracker.formatDatesInModel,
  parse: DateTracker.parseDatesInModel,
  queryBuilder() {
    return new ProjectsQueryBuilder(this, UsersModel.prototype);
  }
};

const classProps = {
  typeName: `projects`,
  filters: {
    user_id(queryBuilder, value) {
      return queryBuilder.whereIn(`user_id`, value);
    }
  },
  relations: [
    `user`,
    `files`
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
