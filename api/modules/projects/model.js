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
