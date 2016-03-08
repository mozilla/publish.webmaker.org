'use strict';

var Lab = require(`lab`);
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require(`code`).expect;

var config = require(`../../../lib/fixtures/publishedProjects`).getOne;
var server;

var validDateResponse = require(`../../../lib/utils`).validDateResponse;

before(done => {
  require(`../../../lib/mocks/server`)(testServer => {
    server = testServer;

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

// GET /publishedProjects/:publishedProject_id
experiment(`[Get one published project]`, () => {
  test(`success case`, done => {
    var options = config.success.default;

    server.inject(options, response => {
      expect(response.statusCode).to.equal(200);

      expect(response.result).to.exist();
      expect(response.result.id).to.be.a.number();
      expect(response.result.title).to.be.a.string();
      expect(response.result.tags).to.be.a.string();
      expect(response.result.description).to.be.a.string();
      expect(response.result.date_created).to.satisfy(validDateResponse);
      expect(response.result.date_updated).to.satisfy(validDateResponse);

      done();
    });
  });

  test(`publishedProject_id must be a number`, done => {
    var options = config.fail.invalidPublishedProjectId;

    server.inject(options, response => {
      expect(response.statusCode).to.equal(400);
      expect(response.result).to.exist();
      expect(response.result.error).to.equal(`Bad Request`);
      expect(response.result.message).to.be.a.string();

      done();
    });
  });

  test(`publishedProject_id must represent an existing resource`, done => {
    var options = config.fail.publishedProjectDoesNotExist;

    server.inject(options, response => {
      expect(response.statusCode).to.equal(404);
      expect(response.result).to.exist();
      expect(response.result.error).to.equal(`Not Found`);

      done();
    });
  });
});
