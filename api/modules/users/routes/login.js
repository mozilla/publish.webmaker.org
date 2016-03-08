'use strict';

var errors = require(`../../../classes/errors`);

var schema = require(`../schema`);
var controller = require(`../controller`);

module.exports = [{
  method: `POST`,
  path: `/users/login`,
  config: {
    handler: controller.login.bind(controller),
    description: `Retrieve the user with the passed username, creating if necessary.`,
    validate: {
      payload: schema,
      failAction: errors.attr
    }
  }
}];
