var retrieveTestUsers = require('../users').testUsers;

var validUsers;
var invalidUser;

var create = {};

module.exports = function(cb) {
  if (create.success) {
    return cb(null, create);
  }

  retrieveTestUsers(function(err, users) {
    if (err) return cb(err);

    validUsers = users.valid;
    invalidUser = users.invalid;

    create.success = {
      default: {
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
      },

      useridTypeError: {
        url: '/projects',
        method: 'post',
        payload: {
          title: 'Test project',
          user_id: "thisisastring",
          date_created: '01/01/15',
          date_updated: '01/01/15',
          description: 'A test project',
          tags: 'test, project, foo, whiz'
        }
      },
      titleTypeError: {
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
        url: '/projects',
        method: 'post',
        payload: {}
      },
      useridAbsent: {
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
}
