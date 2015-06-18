var controller = require('../controller');
var query = require('../query');
var Joi = require('joi');
var Errors = require('../../../classes/errors');

module.exports = [{
  method: 'GET',
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
