"use strict";

const Promise = require(`bluebird`);

const Prerequistes = require(`../../../classes/prerequisites`);
const Errors = require(`../../../classes/errors`);

const schema = require(`../schema`);
const filesController = require(`../controller`);

function getUserForProject(request) {
  return Promise.fromCallback(next => {
    return request.server.methods.userForProject(request.payload.project_id, next);
  });
}

module.exports = [{
  method: `POST`,
  path: `/files`,
  config: {
    payload: {
      allow: `multipart/form-data`,
      parse: true,
      output: `file`,
      maxBytes: process.env.FILE_SIZE_LIMIT || 1048576 * 5 // 5mb
    },
    pre: [
      Prerequistes.trackTemporaryFile(),
      Prerequistes.validateCreationPermission(getUserForProject)
    ],
    handler: filesController.create.bind(filesController),
    description: `Create a new file object.`,
    validate: {
      payload: schema,
      failAction: Errors.attrs
    }
  }
}];
