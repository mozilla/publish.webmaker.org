"use strict";

// This file borrowed from api.webmaker.org

const Hoek = require(`hoek`);
const Boom = require(`boom`);
const request = require(`request`);

const connectionString = process.env.ID_SERVER_CONNECTION_STRING;

if (process.env.NODE_ENV !== `test`) {
  Hoek.assert(
    connectionString,
    `You must provide a connection string to an Identity Provider (ID_SERVER_CONNECTION_STRING)`
  );
}

const requestor = request.defaults({
  baseUrl: connectionString,
  uri: `/user`,
  method: `get`,
  json: true
});

function defaultTokenValidator(token, callback) {
  requestor({
    headers: {
      authorization: `token ${token}`
    }
  }, function(error, response, body) {
    if (error) {
      return callback(error);
    }

    if (response.statusCode !== 200) {
      if (response.statusCode === 401) {
        return callback(null, false);
      }

      return callback(Boom.wrap(
        new Error(body.message),
        response.statusCode,
        body.message
      ));
    }

    // coerce id to string, for compatibility with pg bigint type
    body.id = body.id.toString();

    callback(null, true, body);
  });
}

function exportTokenValidationCallback(err, id, token, callback) {
  if (err) {
    if (typeof err === Error) {
      return callback(err);
    }

    console.error(err);
    return callback(null, false);
  }

  callback(null, true, {
    token,
    authorizedId: id
  });
}

function exportProjectTokenValidator(token, callback) {
  this.server.methods.exportProject({ token }, (err, id) => {
    exportTokenValidationCallback(err, id, token, callback);
  });
}

function exportPublishedProjectTokenValidator(token, callback) {
  this.server.methods.exportPublishedProject({ token }, (err, id) => {
    exportTokenValidationCallback(err, id, token, callback);
  });
}

module.exports = {
  defaultTokenValidator,
  exportProjectTokenValidator,
  exportPublishedProjectTokenValidator
};
