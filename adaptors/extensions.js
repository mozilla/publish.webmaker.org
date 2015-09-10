var fs = require('fs');

exports.clearTemporaryFile = function clearTemporaryFile(req, reply) {
  if (req.response.isBoom) {
    return reply.continue();
  }

  // Once a successful request completes, we delete any
  // temporary files we created
  req.response.once('finish', function() {
    if (!req.app.tmpFile) {
      return;
    }

    fs.unlink(req.app.tmpFile, function(err) {
      if (err) {
        req.log.error('Failed to destroy temporary file with ' + err);
      }
    });
  });

  reply.continue();
};

exports.logRequest = function logRequest(req, reply) {
  // We don't want to clutter the terminal, so only
  // show request details if this was an error
  if (!req.response.isBoom) {
    reply.continue();
    return;
  }

  var data = req.response.data;
  var error = data && data.error;

  // Prefer the error object stack over the
  // boom object stack
  var stack = error && error.stack || req.response.stack;

  var logLevel = 'error';
  if (!data || data.debug) {
    // Errors we process will contain a "data" property
    // containing the error object (or string) and the
    // level of the error. If it doesn't exist, then the `boom`
    // object was created by the framework and represents an
    // error we don't care about under normal circumstances
    logLevel = 'debug';
  }

  req.log[logLevel]({
    request: req,
    response: req.response,
    error: error,
    stack: stack
  });

  reply.continue();
};

