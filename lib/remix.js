var Hoek = require('hoek');
var Url = require('url');

var REMIX_SCRIPT = process.env.REMIX_SCRIPT;
Hoek.assert(REMIX_SCRIPT, 'Must define location of the remix script');

var remixUrl = Url.parse(REMIX_SCRIPT);

function injectMetadata(html, metadata) {
  var metaTags = '';

  Object.keys(metadata).forEach(function(key) {
    metaTags += '<meta name="data-remix-' + key + '" content="' + metadata[key] + '">\n';
  });

  return html.replace(/<head>/, '$&' + metaTags);
}

function injectRemixScript(html) {
  var scriptTag = '<script src="' + REMIX_SCRIPT + '" type="text/javascript"></script>';
  return html.replace(/<\/head/, scriptTag + '\n$&');
}

// Inject the Remix script into the given HTML string
// and any metadata (passed as an object) that needs to be added
function inject(srcHtml, metadata) {
  return injectMetadata(injectRemixScript(srcHtml), metadata);
}

module.exports = {
  inject: inject,
  resourceHost: remixUrl.protocol + (remixUrl.slashes ? '//' : '') + remixUrl.host
};
