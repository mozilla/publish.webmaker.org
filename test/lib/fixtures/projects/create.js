var retrieveTestUsers = require('../users').testUsers;

var validUsers;
var invalidUser;

var create = {};

var userToken = {
  authorization: 'token ag-dubs'
};

module.exports = function(cb) {
  if (create.success) {
    return cb(null, create);
  }

  retrieveTestUsers(function(err, users) {
    if (err) { return cb(err); }

    validUsers = users.valid;
    invalidUser = users.invalid;

    create.success = {
      default: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      }
    };

    create.fail = {
      userDoesNotExist: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: 999999,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },

      useridTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: 'thisisastring',
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      titleTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 123,
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      dateCreatedTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: 123,
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      dateUpdatedTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: 123,
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      descriptionTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 123,
          tags: 'test, project, foo, whiz'
        }
      },
      tagsTypeError: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 123
        }
      },

      payloadAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {}
      },
      useridAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      titleAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      dateCreatedAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      dateUpdatedAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      tagsAbsent: {
        headers: userToken,
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: validUsers[0].id,
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project'
        }
      }
    };

    cb(null, create);
  });
};
