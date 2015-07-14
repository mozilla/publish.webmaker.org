var BaseModel = require('../../classes/base_model');

var Projects = require('../projects/model');

var instanceProps = {
  tableName: 'users',
  projects: function() {
    return this.hasMany(Projects);
  }
};

var classProps = {
  typeName: 'comics',
  filters: {
    name: function (qb, value) {
      return qb.whereIn('name', value);
    }
  },
  relations: [
    'projects'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
