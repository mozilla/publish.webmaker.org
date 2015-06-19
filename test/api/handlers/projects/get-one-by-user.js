var Lab = require('lab');
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require("../../../lib/fixtures/projects").getOneByUser;
var server;

before(function(done) {
  require('../../../lib/mocks/server')(function(obj) {
    server = obj;
    config(function(err, getAllByProject) {
      if (err) throw err;

      config = getAllByProject;
      done();
    });
  });
});

after(function(done) {
  server.stop(done);
});

// GET /users/:user_id/project/:project_id
experiment('[Get a project of a user]', function() {
  test('success case', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);

      expect(resp.result).to.exist();
      expect(resp.result.id).to.be.a.number();
      expect(resp.result.user_id).to.be.a.number();
      expect(resp.result.date_created).to.be.a.string();
      expect(resp.result.date_updated).to.be.a.string();
      expect(resp.result.title).to.be.a.string();

      done();
    });
  });

  test('user_id must reference an existing project', function(done) {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Not Found');

      done();
    });
  });

  test('user_id must be a number', function(done) {
    var opts = config.fail.invalidUserId;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`id` invalid');

      done();
    });
  });

  test('project_id must reference an existing project', function(done) {
    var opts = config.fail.projectDoesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Not Found');

      done();
    });
  });

  test('project_id must be a number', function(done) {
    var opts = config.fail.invalidProjectId;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`id` invalid');

      done();
    });
  });
});
