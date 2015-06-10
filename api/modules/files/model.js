var BaseModel = require('../../classes/base_model');

var instanceProps = {
  tableName: 'files',
  project: function () {
    return this.belongsTo(require('../projects/model'));
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
    'project'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
