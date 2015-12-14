var BaseModel = require('../../classes/base_model');

var dateTracker = require('../../../lib/utils').dateTracker;

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
  format: dateTracker.formatDatesInModel.bind(this),
  parse: dateTracker.parseDatesInModel.bind(this),
  queries: function() {
    var self = this;
    var Project = this.constructor;

    return {
      getOne: function(id) {
        return new Project().query()
        .where(self.column('id'), id)
        .then(function(projects) {
          return self.parse(projects[0]);
        });
      },
      updateOne: function(id, updatedValues) {
        return new Project().query()
        .where(self.column('id'), id)
        .update(self.format(updatedValues))
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
