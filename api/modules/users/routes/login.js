var controller = require('../controller');
var query = require('../query');
var schema = require('../schema');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'POST',
  path: '/users/login',
  config: {
    handler: controller.login,
    description: 'Retrieve the collection of all users.',
    validate: {
      payload: schema,
      failAction: Errors.attr  
     }
   }
 }];
