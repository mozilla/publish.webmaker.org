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
