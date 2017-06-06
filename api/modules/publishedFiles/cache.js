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
    // We want to override the base config since we want to implement our own
    // caching process
    return null;
  }

  // NO Cache hit / FULL DB hit
  _getAllDataFromDB(metaKey, bufferKeyPrefix, publishedProjectId) {
    const publishedFiles = [];
    publishedFilesMeta = [];

    // Get all the metadata and buffers from the db with one query
    return PublishedFiles.query({
      where: {
        published_id: publishedProjectId
      }
    })
    .fetchAll()
    .then(publishedFileModels => {
      // For each published file from the db:
      // 1. Accumulate a POJO copy of it in an array to be returned back,
      // 2. Accumulate the metadata in an array, and
      // 3. Cache its buffer
      return Promise.map(publishedFileModels, publishedFileModel => {
        const publishedFile = publishedFileModel.toJSON();

        publishedFiles.push(publishedFile);
        publishedFilesMeta.push({
          id: publishedFile.id,
          path: publishedFile.path
        });

        return this.cache.setex(
          `${bufferKeyPrefix}:${publishedFile.id}`,
          PUBLISHED_FILE_CACHE_EXPIRY_MS,
          publishedFile.buffer
        );
      });
    })
    .then(() => {
      // Cache the accumulated metadata
      return this.cache.setex(
        metaKey,
        PUBLISHED_FILE_CACHE_EXPIRY_MS,
        publishedFilesMeta
      );
    })
    // Return the array of POJO published files
    .then(() => publishedFiles);
  }

  // PARTIAL Cache/DB hit since we only run this function if the buffer does
  // not exist in the cache
  _getBufferFromDB(bufferKeyPrefix, publishedFileId) {
    // Fetch the buffer from the db
    return PublishedFiles.query({
      where: {
        id: publishedFileId
      }
    })
    .fetch({
      columns: [`buffer`]
    })
    .then(publishedFile => {
      const publishedFileBuffer = publishedFile.get(`buffer`);

      // Cache the buffer before we return it
      return this.setex(
        `${bufferKeyPrefix}:${publishedFileId}`,
        PUBLISHED_FILE_CACHE_EXPIRY_MS,
        publishedFileBuffer
      )
      .then(() => publishedFileBuffer);
    });
  }

  // PARTIAL or FULL Cache hit / PARTIAL or NO DB hit
  _getAllBuffersFromCache(bufferKeyPrefix, publishedFilesMeta) {
    // Accumulate all the POJO representations of the published files in an
    // array to return them
    return Promise.reduce(publishedFilesMeta, (publishedFiles, publishedFileMeta) => {
      const publishedFileId = publishedFileMeta.id;

      // Attempt to get the buffer from the cache
      return this.cache.getBuffer(`${bufferKeyPrefix}:${publishedFileId}`)
      .then(publishedFileBuffer => {
        if (publishedFileBuffer) {
          // FULL Cache hit / NO DB hit
          // Combine the metadata and buffer and return a POJO representation
          // of it
          console.log(`Cache hit for buffer`);
          publishedFileMeta.buffer = publishedFileBuffer;
          publishedFiles.push(publishedFileMeta);

          return publishedFiles;
        }

        // Partial Cache/DB hit
        // Get the buffer from the db
        return this._getBufferFromDB(bufferKeyPrefix, publishedFileId)
        .then(publishedFileBuffer => {
          console.log(`DB hit for buffer`);
          publishedFileMeta.buffer = publishedFileBuffer;
          publishedFiles.push(publishedFileMeta);

          return publishedFiles;
        });
      });
    }, []);
  }

  run(publishedProjectId, next) {
    if (!this.cache) {
      console.log(`Cache not enabled`);
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
    const bufferKeyPrefix = `publishedFile`;

    return this.cache.get(metaKey)
    .then(publishedFilesMeta => {
      if (!publishedFilesMeta) {
        return this._getAllDataFromDB(metaKey, bufferKeyPrefix, publishedProjectId);
      }

      console.log(`Cache hit for metadata`);
      return this._getAllBuffersFromCache(bufferKeyPrefix, publishedFilesMeta);
    })
    .then(() => next(null, publishedFiles))
    .catch(next);
  }
}

module.exports = {
  PublishedFilesByPublishedProjectCache
};
