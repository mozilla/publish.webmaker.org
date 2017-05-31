"use strict";

const DEFAULT_CACHE_EXPIRY_MS = 15 * 60 * 1000;

class BaseCache {
  static get name() {
    throw new Error(`name property has not been set in subclass`);
  }

  static get config() {
    return {
      expiresIn: DEFAULT_CACHE_EXPIRY_MS
    };
  }

  static run() {
    throw new Error(`run function has not been implemented in subclass or has been called incorrectly`);
  }
}

module.exports = BaseCache;
