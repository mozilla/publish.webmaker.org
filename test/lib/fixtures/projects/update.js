'use strict';

var retrieveTestProjects = require(`./test-projects`);

var validProjects;

var update = {};

var userToken = {
  authorization: `token ag-dubs`
};

module.exports = function(cb) {
  if (update.success) {
    return cb(null, update);
  }

  retrieveTestProjects((err, projects) => {
    if (err) { return cb(err); }

    validProjects = projects.valid;

    update.success = {
      default: {
        headers: userToken,
        url: `/projects/` + validProjects[0].id,
        method: `put`,
        payload: {
          title: validProjects[0].title,
          user_id: validProjects[0].user_id,
          date_created: validProjects[0].date_created,
          date_updated: `01/01/15`,
          description: validProjects[0].description,
          tags: validProjects[0].tags
        }
      }
    };

    update.fail = {
      projectDoesNotExist: {
        headers: userToken,
        url: `/projects/999999`,
        method: `put`,
        payload: {
          title: validProjects[0].title,
          user_id: validProjects[0].user_id,
          date_created: validProjects[0].date_created,
          date_updated: `01/01/15`,
          description: validProjects[0].description,
          tags: validProjects[0].tags
        }
      },
      projectidTypeError: {
        headers: userToken,
        url: `/projects/thisisastring`,
        method: `put`,
        payload: {
          title: validProjects[0].title,
          user_id: validProjects[0].user_id,
          date_created: validProjects[0].date_created,
          date_updated: `01/01/15`,
          description: validProjects[0].description,
          tags: validProjects[0].tags
        }
      }
    };

    cb(null, update);
  });
};
