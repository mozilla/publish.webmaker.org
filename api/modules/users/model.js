'use strict';

var BaseModel = require(`../../classes/base_model`);

var Projects = require(`../projects/model`);

var instanceProps = {
  tableName: `users`,
  projects: function() {
    return this.hasMany(Projects);
  },
  queries: function() {
    var self = this;
    var User = this.constructor;

    return {
      getOne: function(id) {
        return new User().query()
        .where(self.column(`id`), id)
        .then(users => users[0]);
      }
    };
  }
};

var classProps = {
  typeName: `comics`,
  filters: {
    name: function (qb, value) {
      return qb.whereIn(`name`, value);
    }
  },
  relations: [
    `projects`
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
