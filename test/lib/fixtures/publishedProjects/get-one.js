'use strict';

var retrieveTestPublishedProjects = require(`./test-publishedProjects`);

var validPublishedProjects;
var getOne = {};

module.exports = function(callback) {
  if (getOne.success) {
    return callback(null, getOne);
  }

  retrieveTestPublishedProjects((err, publishedProjects) => {
    if (err) {
      return callback(err);
    }

    validPublishedProjects = publishedProjects.valid;

    getOne.success = {
      default: {
        url: `/publishedProjects/` + validPublishedProjects[0].id,
        method: `get`
      }
    };

    getOne.fail = {
      invalidPublishedProjectId: {
        url: `/publishedProjects/thisisastring`,
        method: `get`
      },
      publishedProjectDoesNotExist: {
        url: `/publishedProjects/9999999`,
        method: `get`
      }
    };

    callback(null, getOne);
  });
};
