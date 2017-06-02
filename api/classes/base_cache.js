"use strict";

const Hoek = require(`hoek`);

const DEFAULT_CACHE_EXPIRY_MS = 15 * 60 * 1000;
const DEFAULT_CACHE_REQUEST_TIMEOUT_MS = 60 * 1000;

class BaseCache {
  constructor(server) {
    if (!server.app.cacheEnabled) {
      return;
    }

    // We poll for access to a ready cache client before we can use the cache
    // since catbox does not expose events to know when the cache client is
    // ready to use
    server.once(`start`, () => {
      const catboxEngine = server.root._caches._default.client.connection;
      const intervalId = setInterval(() => {
        if (catboxEngine.isReady()) {
          Hoek.assert(catboxEngine.client && typeof catboxEngine.client === `object`, `Can't find redis client in Catbox engine`);
          clearInterval(intervalId);
          this.cache = catboxEngine.client;
        }
      }, 500);
    });
  }

  get name() {
    throw new Error(`name property has not been set in subclass`);
  }

  get config() {
    return {
      expiresIn: DEFAULT_CACHE_EXPIRY_MS,
      generateTimeout: DEFAULT_CACHE_REQUEST_TIMEOUT_MS
    };
  }

  run() {
    throw new Error(`run function has not been implemented in subclass or has been called incorrectly`);
  }
}

module.exports = BaseCache;
