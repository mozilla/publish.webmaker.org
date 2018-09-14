"use strict";

const ExportCache = require(`../../classes/base_export_cache`);

class ExportPublishedProjectCache extends ExportCache {
  constructor(server) {
    super(server, `published project`, `exportpublishedproject`);
  }

  get name() {
    return `exportPublishedProject`;
  }
}

module.exports = {
  ExportPublishedProjectCache
};
