var BaseModel = require('../../classes/base_model');

var instanceProps = {
  tableName: 'publishedFiles',
  project: function() {
    return this.belongsTo(require('../publishedProjects/model'));
  }
};

var classProps = {
  typeName: 'publishedFiles',
  filters: {
    project_id: function (qb, value) {
      return qb.whereIn('project_id', value);
    }
  },
  relations: [
    'publishedProject'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
