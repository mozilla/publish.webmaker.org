"use strict";

const Files = require(`./model`);

const BaseCache = require(`../../classes/base_cache`);

class RemixedFileCreationCache extends BaseCache {
  static get name() {
    return `createdRemixFile`;
  }

  static get config() {
    return Object.assign(super.config, {
      segment: `file_buffers`
    });
  }

  // eslint-disable-next-line no-unused-vars
  static generateKey(fileId, fileBuffer) {
    return fileId;
  }

  static run(fileId, fileBuffer, next) {
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
