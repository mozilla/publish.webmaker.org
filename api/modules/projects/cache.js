"use strict";

const ExportCache = require(`../../classes/base_export_cache`);

class ExportProjectCache extends ExportCache {
  constructor(server) {
    super(server, `project`, `exportproject`);
  }

  get name() {
    return `exportProject`;
  }
}

module.exports = {
  ExportProjectCache
};
