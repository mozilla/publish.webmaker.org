"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("File", {
    path: DataTypes.STRING,
    type: DataTYpes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        File.belongsTo(models.Project);
      }
    }
  });

  return File;
};
