"use strict";

const Files = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

class RemixedFileCreationCache extends BaseCache {
  get name() {
    return `createdRemixFile`;
  }

  get config() {
    // We want to override the base config since we want to implement our own
    // caching process
    return null;
  }

  run(fileId, fileBuffer, next) {

    if(typeof fileBuffer !== `function`) {
      return next(null, fileBuffer);
    }

    next = fileBuffer;
    fileBuffer = null;

    return Files.query({
      where: {
        id: fileId
      },
      columns: [`buffer`]
    })
    .fetch()
    .then(file => {
      console.log(`Typeof buffer: `, typeof file.get(`buffer`));
      next(null, file && file.get(`buffer`));
    })
    .catch(next);
  }
}

module.exports = {
  RemixedFileCreationCache
};
