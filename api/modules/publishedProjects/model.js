var BaseModel = require('../../classes/base_model');

var Projects = require('../projects/model');

var dateTracker = require('../../../lib/utils').dateTracker;

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
  format: dateTracker.formatDatesInModel.bind(this),
  parse: dateTracker.parseDatesInModel.bind(this),
  queries: function() {
    var self = this;
    var PublishedProject = this.constructor;

    return {
      getOne: function(id) {
        return new PublishedProject().query()
        .where(self.column('id'), id)
        .then(function(publishedProjects) {
          return self.parse(publishedProjects[0]);
        });
      },
      createOne: function(data) {
        return new PublishedProject().query()
        .insert(self.format(data), 'id')
        .then(function(ids) {
          return ids[0];
        });
      },
      updateOne: function(id, updatedValues) {
        return new PublishedProject().query()
        .where(self.column('id'), id)
        .update(self.format(updatedValues))
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
