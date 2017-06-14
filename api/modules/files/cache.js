"use strict";

const Files = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

const DEFAULT_BUFFER_CACHE_EXPIRY_SEC = 10 * 60;

function getBufferFromDB(fileId, next) {
  return Files.query({
    where: {
      id: fileId
    },
    columns: [`buffer`]
  })
  .fetch()
  .then(file => next(null, file && file.get(`buffer`)))
  .catch(next);
}

class FileCache extends BaseCache {
  constructor(server) {
    super(server);
  }

  get name() {
    return `file`;
  }

  get config() {
    // We want to override the base config since we want to implement our own
    // caching process
    return null;
  }

  /*
   * This method takes an optional `fileBuffer` argument
   * If the `fileBuffer` was passed in, it writes it to cache
   * If not, the callback is called with a `fileBuffer` retrieved from cache
   */
  run(fileId, fileBuffer, next) {
    /*
     * Putting the file buffer into cache
     */

    if (typeof fileBuffer !== `function`) {
      if (!this.cache) {
        return next(null, fileBuffer);
      }

      return this.cache.setex(`file:${fileId}`, DEFAULT_BUFFER_CACHE_EXPIRY_SEC, fileBuffer)
      .then(() => next(null, fileBuffer))
      .catch(next);
    }

    next = fileBuffer;
    fileBuffer = null;

    /*
     * Getting the file buffer from cache
     */

    if (!this.cache) {
      return getBufferFromDB(fileId, next);
    }

    return this.cache.getBuffer(`file:${fileId}`)
    .then(cachedFileBuffer => {
      if (!cachedFileBuffer) {
        return getBufferFromDB(fileId, next);
      }

      next(null, cachedFileBuffer);
    })
    .catch(next);
  }

  drop(fileId, next) {
    if (!this.cache) {
      return next();
    }

    return this.cache.del(`file:${fileId}`)
    .then(() => next())
    .catch(next);
  }
}

module.exports = {
  FileCache
};
