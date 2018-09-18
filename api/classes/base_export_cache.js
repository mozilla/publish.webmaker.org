"use strict";

const Hoek = require(`hoek`);

const BaseCache = require(`./base_cache`);
const Tokenizer = require(`../../lib/utils`).Tokenizer;

class ExportCache extends BaseCache {
  constructor(server, resourceName, keyPrefix, cacheExpirySec=30*60) {
    Hoek.assert(resourceName, `A resource name must be provided when extending the ExportCache class.`);
    Hoek.assert(keyPrefix, `A prefix for keys in the cache must be provided when extending the ExportCache class.`);

    super(server);
    this.resourceName = resourceName;
    this.keyPrefix = keyPrefix;
    this.cacheExpirySec = cacheExpirySec;
  }

  get config() {
    // We want to override the base config since we want to implement our own
    // caching process
    return null;
  }

  /*
   * This method takes an object `resourceIdentifier` as an argument
   * If the `token` property is set in the object, it verifies that an
   * `id` exists for the token and returns it, otherwise throws an error
   * If the `id` property is set in the object, it generates a token for the
   * resource corresponding to the `id`, and stores it in cache
   * If neither property is present in the object, it throws an error
   */
  run(resourceIdentifier, next) {
    /*
     * Validating an existing token for a resource
     */
    if (!resourceIdentifier) {
      return next(new Error(`Fatal Error: No resource identifier was passed in.`));
    }

    const { id, token } = resourceIdentifier;

    if (typeof token === `string`) {
      if (!this.cache) {
        return next(null, token);
      }

      let saltedToken = ``;

      try {
        saltedToken = Tokenizer.salt(token);
      } catch(err) {
        return next(err);
      }

      return this.cache.get(`${this.keyPrefix}:${saltedToken}`)
      .then(cachedId => {
        if (!cachedId) {
          throw new Error(`Token ${saltedToken} provided for ${this.resourceName} is invalid`);
        }

        return next(null, parseInt(cachedId));
      })
      .catch(next);
    }

    if (typeof id !== `number`) {
      return next(new Error(`Fatal Error: Resource identifier does not contain an id or token.`));
    }

    /*
     * Generating a token for a resource
     */
    if (!this.cache) {
      return next(null, id);
    }

    return Tokenizer.generate((err, generatedToken) => {
      if (err) {
        return next(err);
      }

      this.cache.setex(
        `${this.keyPrefix}:${generatedToken.salted}`,
        this.cacheExpirySec,
        id
      )
      .then(() => next(null, generatedToken.value))
      .catch(next);
    });
  }

  drop(token, next) {
    if (!this.cache) {
      return next();
    }

    const saltedToken = Tokenizer.salt(token);

    return this.cache.del(`${this.keyPrefix}:${saltedToken}`)
    .then(() => next())
    .catch(next);
  }
}

module.exports = ExportCache;
