'use strict';

var BaseModel = require(`../../classes/base_model`);

var File = require(`../files/model`);

var instanceProps = {
  tableName: `publishedFiles`,
  project: function() {
    return this.belongsTo(require(`../publishedProjects/model`));
  },
  queries: function() {
    var self = this;
    var FilesTable = File.prototype;
    var PublishedFile = this.constructor;

    return {
      getOne: function(id) {
        return new PublishedFile().query()
        .where(self.column(`id`), id)
        .then(publishedFiles => publishedFiles[0]);
      },
      getAllNewFiles: function(projectId) {
        return new File().query()
        .leftOuterJoin(self.tableName,
                       FilesTable.column(`id`),
                       self.column(`file_id`))
        .where(FilesTable.column(`project_id`), projectId)
        .whereNull(self.column(`file_id`))
        .select(FilesTable.column(`id`),
                FilesTable.column(`path`),
                FilesTable.column(`buffer`));
      },
      getAllModifiedFiles: function(publishedId) {
        return new PublishedFile().query()
        .innerJoin(FilesTable.tableName,
                   self.column(`file_id`),
                   FilesTable.column(`id`))
        .where(self.column(`published_id`), publishedId)
        .where(() => {
          this.whereRaw(self.column(`path`, null, true) +
                        ` <> ` +
                        FilesTable.column(`path`, null, true) +
                        ` OR ` +
                        self.column(`buffer`, null, true) +
                        ` <> ` +
                        FilesTable.column(`buffer`, null, true));
        })
        .select(self.column(`id`),
                self.column(`path`, `oldPath`),
                FilesTable.column(`path`),
                FilesTable.column(`buffer`));
      },
      getAllDeletedFiles: function(publishedId) {
        return new PublishedFile().query()
        .where(self.column(`published_id`), publishedId)
        .whereNull(self.column(`file_id`))
        .select(self.column(`id`),
                self.column(`path`));
      },
      getAllPaths: function(publishedId) {
        return new PublishedFile().query()
        .where(self.column(`published_id`), publishedId)
        .select(self.column(`path`))
        .then(publishedFiles => {
          // Return an array of paths vs. an array of objects containing
          // only paths
          return publishedFiles.map(publishedFile => publishedFile.path);
        });
      },
      createOne: function(publishedFileData) {
        return new PublishedFile().query()
        .insert(publishedFileData, `id`)
        .then(ids => ids[0]);
      },
      updateOne: function(id, updatedValues) {
        return new PublishedFile().query()
        .where(self.column(`id`), id)
        .update(updatedValues)
        .then(() => id);
      },
      deleteOne: function(id) {
        return new PublishedFile().query()
        .where(self.column(`id`), id)
        .del();
      },
      deleteAll: function(publishedId) {
        return new PublishedFile().query()
        .where(self.column(`published_id`), publishedId)
        .del();
      }
    };
  }
};

var classProps = {
  typeName: `publishedFiles`,
  filters: {
    project_id: function (qb, value) {
      return qb.whereIn(`project_id`, value);
    }
  },
  relations: [
    `publishedProject`
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
