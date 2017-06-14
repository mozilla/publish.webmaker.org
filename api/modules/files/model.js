"use strict";

const BaseModel = require(`../../classes/base_model`);

const ProjectsModel = require(`../projects/model`);
const UsersModel = require(`../users/model`);


class FilesQueryBuilder {
  constructor(context, projectsTable, usersTable) {
    this.context = context;
    this.FilesModel = context.constructor;
    this.projectsTable = projectsTable;
    this.usersTable = usersTable;
  }

  getUserForFileById(fileId) {
    return new this.FilesModel()
    .query()
    .innerJoin(
      this.projectsTable.tableName,
      this.projectsTable.column(`id`),
      this.context.column(`project_id`)
    )
    .innerJoin(
      this.usersTable.tableName,
      this.usersTable.column(`id`),
      this.projectsTable.column(`user_id`)
    )
    .where(this.context.column(`id`), fileId)
    .select(
      this.usersTable.column(`id`),
      this.usersTable.column(`name`)
    )
    .then(records => records && records[0]);
  }
}

const instanceProps = {
  tableName: `files`,
  project() {
    return this.belongsTo(ProjectsModel);
  },
  user() {
    // We require in the function as opposed to adding a top-level require
    // to resolve the circular dependencies between models
    return this.belongsTo(require(`../users/model`)).through(ProjectsModel);
  },
  queryBuilder() {
    return new FilesQueryBuilder(this, ProjectsModel.prototype, UsersModel.prototype);
  }
};

const classProps = {
  typeName: `files`,
  filters: {
    project_id(qb, value) {
      return qb.whereIn(`project_id`, value);
    }
  },
  relations: [
    `project`,
    `user`
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
