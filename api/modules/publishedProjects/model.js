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
