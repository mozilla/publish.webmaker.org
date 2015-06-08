"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable(
      'Users', {
        name: DataTypes.STRING
      });
    migration.createTable(
      'Projects', {
        title: DataTypes.STRING,
        user_name: DataTypes.STRING
      });
    migration.createTable(
      'Files', {
        path: DataTypes.STRING,
        type: DataTypes.STRING,
        project_title: DataTypes.STRING
      })
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('Users');
    migration.dropTable('Projects');
    migration.dropTable('Files');
  }
};
