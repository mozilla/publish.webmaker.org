const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'files',
  comic: function () {
    return this.belongsTo(require('../projects/model'));
  }
};

const classProps = {
  typeName: 'files',
  filters: {
    project_id: function (qb, value) {
      return qb.whereIn('project_id', value);
    }
  },
  relations: [
    'project'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
