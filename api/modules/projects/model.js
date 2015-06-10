var BaseModel = require('../../classes/base_model');

var instanceProps = {
  tableName: 'projects',
  user: function () {
    return this.belongsTo(require('../users/model'));
  },
  files: function() {
    return this.hasMany(require('../files/model'));
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
