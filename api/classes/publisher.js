var knox = require('knox');
var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET
});

var log = require('../../logger.js');
var File = require('../modules/Files/model');

var isPublished = function(project) {
  return project.get('publish_url') !== null;
};

var publishFiles = function(project, params) {
  File.query({
    where: {
      project_id: project.id
    }
  }).fetchAll()
  .then(function(records){
    records.mapThen(function(record) {
      uploadFile(record, params);
    });
  }).catch(function(e) {
    log.error(e);
    return false;
  });
  return true;
};

var uploadFile = function(file) {
  var buffer = file.get('buffer');
  var key = file.get('path');  
  var headers = {
    'Content-Type': 'application/octet-stream'
  }

  client.putBuffer(buffer, key, headers, function(err, res){
    if(err) {
      log.error(err)
    } else {
      if (200 == res.statusCode) {
        log.info('Successfully uploaded ' + key);
      }
    }
  });
}

var deleteFiles = function(project) {
  File.query({
    where: {
      project_id: project.id
    }
  }).fetchAll()
  .then(function(records){
    client.deleteMultiple(records.models, function(err, res){
      if(err) {
        log.error(err);
      } else {
        log.info(res.statusCode);
        log.info('Successfully unpublished ' + project.get('title'));
      }
    })
  }).catch(function(e) {
    log.error(e);
    return false;
  });
  return true;
}

var build_url= function(project) {
  var url = 'd3g6se91hcs80r.cloudfront.net' + '/' +
             client.bucket + '/' +
             project.get('title');
  return url;
}

var set_url = function(project, url){
  project.set({ publish_url:  url }).save();
  return project;
}

var msg_success = function(project) { 
  log.info( 'Successfully published ' +
            project.get('title') +
            ' to ' + project.get('publish_url'));
  
  return project;
};

exports.publish = function(project) {
  new Promise(
    function(resolve, reject) {
      var success = publishFiles(project);
      success ? resolve(project) : log.error("Something went wrong.");
    }
  )
  .then(function(project) {
    set_url(project, build_url(project));
    msg_success(project);
  })
  .catch(function(err){
    log.error(err);
  })
};

exports.unpublish = function(project) {
  var message = '';
  if (isPublished(project)) {
    project.set({ publish_url: null }).save();
    message =  'Successfully unpublished ' + project.get('title');
  } else {
    message = 'Cannot unpublish an project that is not published.';
  }
  log.info(message);
  return project;
};

module.exports = exports;
