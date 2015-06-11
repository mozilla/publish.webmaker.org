var controller = require('../controller');

module.exports = [{
  method: 'POST',
  path: '/projects',
  config: {
    handler: controller.createProject
  }
}];
