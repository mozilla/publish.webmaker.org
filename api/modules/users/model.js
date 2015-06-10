var BaseModel = require('../../classes/base_model');

var instanceProps = {
  tableName: 'users',
  projects: function () {
    return this.hasMany(require('../projects/model'));
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
