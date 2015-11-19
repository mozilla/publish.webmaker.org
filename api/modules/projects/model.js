var BaseModel = require('../../classes/base_model');

var instanceProps = {
  tableName: 'projects',
  user: function () {
    return this.belongsTo(require('../users/model'));
  },
  files: function() {
    return this.hasMany(require('../files/model'));
  },
  publishedProject: function() {
    return this.belongsTo(require('../publishedProjects/model'), 'published_id');
  },
  format: function(model) {
    if(typeof model === "object") {
      // Have to do this because of this bug: https://github.com/tgriesser/bookshelf/issues/668
      if(model.date_created) {
        model._date_created = new Date(model.date_created);
      }
      if(model.date_updated) {
        model._date_updated = new Date(model.date_updated);
      }
    }

    return model;
  },
  parse: function(model) {
    if(typeof model === "object") {
      delete model._date_created;
      delete model._date_updated;
    }

    return model;
  },
  queries: function() {
    var self = this;
    var Project = this.constructor;

    return {
      getOne: function(id) {
        return new Project().query()
        .where(self.column('id'), id)
        .then(function(projects) {
          return projects[0];
        });
      },
      updateOne: function(id, updatedValues) {
        return new Project().query()
        .where(self.column('id'), id)
        .update(updatedValues)
        .then(function() {
          return id;
        });
      }
    };
  }
};

var classProps = {
  typeName: 'projects',
  filters: {
    user_id: function (qb, value) {
      return qb.whereIn('user_id', value);
    }
  },
  relations: [
    'user',
    'files'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
