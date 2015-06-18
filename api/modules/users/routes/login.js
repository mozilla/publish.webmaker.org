var controller = require('../controller');
var query = require('../query');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'POST',
  path: '/users/login',
  config: {
    handler: controller.login,
    description: 'Retrieve the collection of all users.',
    validate: {
      query: query,
      failAction: Errors.name  
     }
   }
 }];
