'use strict';

var Lab = require(`lab`);
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require(`code`).expect;

var config = require(`../../../lib/fixtures/users`).getOne;
var server;

before(done => {
  require(`../../../lib/mocks/server`)(obj => {
    server = obj;

    config((err, getOne) => {
      if (err) { throw err; }

      config = getOne;
      done();
    });
  });
});

after(done => {
  server.stop(done);
});

// GET /users/:id
experiment(`[Get one user]`, () => {
  test(`success case`, done => {
    var opts = config.success.default;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result).to.exist();
      expect(resp.result.id).to.be.a.number();
      expect(resp.result.name).to.be.a.string();

      done();
    });
  });

  test(`id must be a number`, done => {
    var opts = config.fail.invalidUserid;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.be.a.string();

      done();
    });
  });

  test(`id must represent an existing resource`, done => {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Not Found`);

      done();
    });
  });
});
