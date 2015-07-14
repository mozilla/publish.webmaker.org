var BaseModel = require('../../classes/base_model');

var Projects = require('../projects/model');
var Users = require('../users/model');

var instanceProps = {
  tableName: 'files',
  project: function() {
    return this.belongsTo(Projects);
  },
  user: function() {
    return this.belongsTo(Users).through(Projects);
  }
};

var classProps = {
  typeName: 'files',
  filters: {
    project_id: function (qb, value) {
      return qb.whereIn('project_id', value);
    }
  },
  relations: [
    'project',
    'user'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
