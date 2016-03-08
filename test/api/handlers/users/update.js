'use strict';

var Lab = require(`lab`);
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require(`code`).expect;

var config = require(`../../../lib/fixtures/users`).update;
var server;

before(done => {
  require(`../../../lib/mocks/server`)(obj => {
    server = obj;

    config((err, update) => {
      if (err) { throw err; }

      config = update;
      done();
    });
  });
});

after(done => {
  server.stop(done);
});

// PUT /users/:id
experiment(`[Update a user by id]`, () => {
  test(`success case`, done => {
    server.inject({
      url: `/users`,
      method: `post`,
      payload: {
        name: `TestUser`
      },
      headers: {
        authorization: `token TestUser`
      }
    }, respCreate => {
      expect(respCreate.statusCode).to.equal(201);

      server.inject({
        url: `/users/` + respCreate.result.id,
        method: `put`,
        payload: {
          name: `NewUserName`
        },
        headers: {
          authorization: `token TestUser`
        }
      }, resp => {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result).to.exist();
        expect(resp.result.id).to.be.a.number();
        expect(resp.result.name).to.be.a.string();

        server.inject({
          url: `/users/` + resp.result.id,
          method: `delete`,
          headers: {
            authorization: `token UpdatedTestUser`
          }
        }, respDel => {
          expect(respDel.statusCode).to.equal(204);
          done();
        });
      });
    });
  });

  test(`user must exist`, done => {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Not Found`);

      done();
    });
  });

  test(`user_id must be a number`, done => {
    var opts = config.fail.useridTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`id\` invalid`);

      done();
    });
  });

  test(`returns a 200 when nothing is updated`, done => {
    server.inject({
      url: `/users`,
      method: `post`,
      payload: {
        name: `TestUser`
      },
      headers: {
        authorization: `token TestUser`
      }
    }, respCreate => {
      expect(respCreate.statusCode).to.equal(201);

      server.inject({
        url: `/users/` + respCreate.result.id,
        method: `put`,
        payload: {
          name: `TestUser`
        },
        headers: {
          authorization: `token TestUser`
        }
      }, resp => {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result).to.exist();
        expect(resp.result.id).to.be.a.number();
        expect(resp.result.name).to.be.a.string();

        server.inject({
          url: `/users/` + resp.result.id,
          method: `delete`,
          headers: {
            authorization: `token TestUser`
          }
        }, respDel => {
          expect(respDel.statusCode).to.equal(204);
          done();
        });
      });
    });
  });
});
