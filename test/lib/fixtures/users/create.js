var create = {};

module.exports = function(cb) {
  if (create.success) {
    return cb(null, create);
  }
  create.success = {
    default: {
      url: '/users',
      method: 'post',
      payload: {
        name: "TestUser"
      }
    }
  };

  create.fail = {
    nameAbsent: {
      url: '/users',
      method: 'post',
      payload: {}
    },
    invalidName: {
      url: '/users',
      method: 'post',
      payload: {
        name: 12345
      }
    }
  };

  cb(null, create);
}
