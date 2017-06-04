"use strict";

const PublishedFiles = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

const PUBLISHED_FILE_CACHE_EXPIRY_MS = 10 * 60 * 1000;

class PublishedFilesByPublishedProjectCache extends BaseCache {
  constructor(server) {
    super(server);
  }

  get name() {
    return `publishedFilesByPublishedProject`;
  }

  get config() {
    return null;
  }

  run(publishedProjectId, next) {
    // WIP Need to simplify
    if (!this.cache) {
      return PublishedFiles.query({
        where: {
          published_id: publishedProjectId
        }
      })
      .fetchAll()
      .then(publishedFileModels => {
        return next(null, publishedFileModels.map(model => model.toJSON()));
      })
      .catch(next);
    }

    const metaKey = `publishedProjectFilesMeta:${publishedProjectId}`;

    return this.cache.get(metaKey)
    .then(publishedFilesMeta => {
      if (!publishedFilesMeta) {
        return PublishedFiles.query({
          where: {
            published_id: publishedProjectId
          }
        })
        .fetchAll()
        .then(publishedFileModels => {
          publishedFilesMeta = [];
          const publishedFiles = publishedFileModels.map(publishedFileModel => {
            const publishedFile = publishedFileModel.toJSON();

            publishedFilesMeta.push({
              id: publishedFile.id,
              path: publishedFile.path
            });

            return publishedFile;
          });

          return this.cache.setex(metaKey, PUBLISHED_FILE_CACHE_EXPIRY_MS, publishedFilesMeta)
          .then(() => publishedFiles);
        })
        .then(publishedFiles => {
          return Promise.map(publishedFiles, publishedFile => {
            return this.cache.setex(`publishedFile:${publishedFile.id}`, PUBLISHED_FILE_CACHE_EXPIRY_MS, publishedFile.buffer);
          })
          .then(() => next(null, publishedFiles));
        })
        .catch(next);
      }

      return Promise.reduce(publishedFilesMeta, (publishedFiles, publishedFileMeta) => {
        return this.cache.getBuffer(`publishedFile:${publishedFileMeta.id}`)
        .then(publishedFileBuffer => {
          if (!publishedFileBuffer) {
            // set buffer in cache
            return PublishedFiles.query({
              where: {
                id: publishedFileMeta.id
              }
            })
            .fetch({
              columns: [`buffer`]
            })
            .then(publishedFile => {
              return this.setex(`publishedFile:${publishedFileMeta.id}`, PUBLISHED_FILE_CACHE_EXPIRY_MS, publishedFile.get(`buffer`))
              .then(() => {
                publishedFileMeta.buffer = publishedFileBuffer;
                publishedFiles.push(publishedFileMeta);

                return publishedFiles;
              });
            });
          }

          publishedFileMeta.buffer = publishedFileBuffer;
          publishedFiles.push(publishedFileMeta);

          return publishedFiles;
        });
      }, [])
      .then(publishedFiles => next(null, publishedFiles))
      .catch(next);
    })
    .catch(next);
  }
}

module.exports = {
  PublishedFilesByPublishedProjectCache
};
