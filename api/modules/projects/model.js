const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'projects',
  user: function () {
    return this.belongsTo(require('../users/model'));
  },
  files: function() {
    return this.hasMany(require('../files/model'))
  }
};

const classProps = {
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
