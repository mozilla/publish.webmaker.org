var AWS = require('aws-sdk'); 
var s3 = new AWS.S3(); 

var log = require('../../logger.js')

var isPublished = function(project){
  return project.get('publish_url') !== null;
};

exports.publish = function(project) {
  var url = "FAKE://URL";
  project.set({ publish_url:  url }).save();
  log.info("Successfully published " + 
          project.get('title') +
          " to " + project.get('publish_url'));
  return project;
};

exports.unpublish = function(project) {
  var message = "";
  if (isPublished(project)) {
    project.set({ publish_url: null }).save();
    message =  "Successfully unpublished " + project.get('title');
  } else {
    message = "Cannot unpublish an project that is not published.";
  }
  log.info(message);
  return project;
};

module.exports = exports;
