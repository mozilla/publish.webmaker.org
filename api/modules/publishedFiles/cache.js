"use strict";

const Promise = require(`bluebird`);

const PublishedFiles = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

const PUBLISHED_FILE_CACHE_EXPIRY_SEC = 10 * 60;
const META_KEY_PREFIX = `publishedProjectFilesMeta`;

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
    const publishedFilesMeta = [];

    // Get all the metadata and buffers from the db with one query
    return PublishedFiles.query({
      where: {
        published_id: publishedProjectId
      }
    })
    .fetchAll()
    .then(result => {
      // For each published file from the db:
      // 1. Accumulate a simple js object copy of it in an array to be
      //    returned back,
      // 2. Accumulate the metadata in an array, and
      // 3. Cache its buffer
      return Promise.map(result.models, publishedFileModel => {
        const publishedFile = publishedFileModel.toJSON();

        publishedFiles.push(publishedFile);
        publishedFilesMeta.push({
          id: publishedFile.id,
          path: publishedFile.path
        });

        return this.cache.setex(
          `${bufferKeyPrefix}:${publishedFile.id}`,
          PUBLISHED_FILE_CACHE_EXPIRY_SEC,
          publishedFile.buffer
        );
      });
    })
    .then(() => {
      // Cache the accumulated metadata
      return this.cache.setex(
        metaKey,
        PUBLISHED_FILE_CACHE_EXPIRY_SEC,
        JSON.stringify(publishedFilesMeta)
      );
    })
    // Return the array of simple js objects of published files
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
        PUBLISHED_FILE_CACHE_EXPIRY_SEC,
        publishedFileBuffer
      )
      .then(() => publishedFileBuffer);
    });
  }

  // PARTIAL or FULL Cache hit / PARTIAL or NO DB hit
  _getAllBuffersFromCache(bufferKeyPrefix, publishedFilesMeta) {
    // Accumulate all the simple js object representations of the published
    // files in an array to return them
    return Promise.reduce(publishedFilesMeta, (publishedFiles, publishedFileMeta) => {
      const publishedFileId = publishedFileMeta.id;

      // Attempt to get the buffer from the cache
      return this.cache.getBuffer(`${bufferKeyPrefix}:${publishedFileId}`)
      .then(publishedFileBuffer => {
        if (publishedFileBuffer) {
          // FULL Cache hit / NO DB hit
          // Combine the metadata and buffer and return a simple javascript
          // object representation of it
          publishedFileMeta.buffer = publishedFileBuffer;
          publishedFiles.push(publishedFileMeta);

          return publishedFiles;
        }

        // Partial Cache/DB hit
        // Get the buffer from the db
        return this._getBufferFromDB(bufferKeyPrefix, publishedFileId)
        .then(publishedFileBufferFromDB => {
          publishedFileMeta.buffer = publishedFileBufferFromDB;
          publishedFiles.push(publishedFileMeta);

          return publishedFiles;
        });
      });
    }, []); // The [] at the end is the accummulator's initial value that will
    // be populated with the published file simple js objects inside the
    // callback passed to `reduce()`. It is referred to as `publishedFiles`
    // inside the callback
  }

  run(publishedProjectId, next) {
    if (!this.cache) {
      return PublishedFiles.query({
        where: {
          published_id: publishedProjectId
        }
      })
      .fetchAll()
      .then(result => {
        return next(null, result.models.map(model => model.toJSON()));
      })
      .catch(next);
    }

    const metaKey = `${META_KEY_PREFIX}:${publishedProjectId}`;
    const bufferKeyPrefix = `publishedFile`;

    return this.cache.get(metaKey)
    .then(publishedFilesMeta => {
      if (!publishedFilesMeta) {
        return this._getAllDataFromDB(metaKey, bufferKeyPrefix, publishedProjectId);
      }

      return this._getAllBuffersFromCache(
        bufferKeyPrefix,
        JSON.parse(publishedFilesMeta)
      );
    })
    .then(publishedFiles => next(null, publishedFiles))
    .catch(next);
  }

  drop(publishedProjectId, next) {
    if (!this.cache) {
      return next();
    }

    return this.cache.del(`${META_KEY_PREFIX}:${publishedProjectId}`)
    .then(() => next())
    .catch(next);
  }
}

module.exports = {
  PublishedFilesByPublishedProjectCache
};
