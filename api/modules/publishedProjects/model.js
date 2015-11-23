var BaseModel = require('../../classes/base_model');

var Projects = require('../projects/model');

var instanceProps = {
  tableName: 'publishedProjects',
  project: function() {
    return this.belongsTo(Projects);
  },
  user: function() {
    return this.belongsTo(require('../users/model')).through(Projects);
  },
  publishedFiles: function() {
    return this.hasMany(require('../publishedFiles/model'));
  },
  format: function(model) {
    if (typeof model === 'object') {
      if (model.date_created) {
        model._date_created = new Date(model.date_created);
        delete model.date_created;
      }
      if (model.date_updated) {
        model._date_updated = new Date(model.date_updated);
        delete model.date_updated;
      }
    }

    return model;
  },
  parse: function(model) {
    if (typeof model === "object") {
      if (model._date_created) {
        model.date_created = model._date_created.toISOString();
        delete model._date_created;
      }
      if (model._date_updated) {
        model.date_updated = model._date_updated.toISOString();
        delete model._date_updated;
      }
    }

    return model;
  },
  queries: function() {
    var self = this;
    var PublishedProject = this.constructor;

    return {
      getOne: function(id) {
        return new PublishedProject().query()
        .where(self.column('id'), id)
        .then(function(publishedProjects) {
          return publishedProjects[0];
        });
      },
      createOne: function(data) {
        return new PublishedProject().query()
        .insert(data, 'id')
        .then(function(ids) {
          return ids[0];
        });
      },
      updateOne: function(id, updatedValues) {
        return new PublishedProject().query()
        .where(self.column('id'), id)
        .update(updatedValues)
        .then(function() {
          return id;
        });
      },
      deleteOne: function(id) {
        return new PublishedProject().query()
        .where(self.column('id'), id)
        .del();
      }
    };
  }
};

var classProps = {
  typeName: 'publishedProjects',
  filters: {
    project_id: function (qb, value) {
      return qb.whereIn('project_id', value);
    }
  },
  relations: [
    'publishedFiles',
    'user'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
