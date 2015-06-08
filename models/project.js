"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Project", {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Project.belongsTo(models.User);
      }
      associate: {
        Project.hasMany(models.File);
      }
    }
  });

  return Project;
};
