var Lab = require('lab');
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require("../../../lib/fixtures/users").update;
var server;

before(function(done) {
  require('../../../lib/mocks/server')(function(obj) {
    server = obj;

    config(function(err, update) {
      if (err) throw err;

      config = update;
      done();
    });
  });
});

after(function(done) {
  server.stop(done);
});

// PUT /users/:id
experiment('[Update a user by id]', function() {
  test('success case', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result).to.exist();
      expect(resp.result.id).to.be.a.number();
      expect(resp.result.name).to.be.a.string();

      done();
    });
  });

  test('user must exist', function(done) {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Not Found');

      done();
    });
  });

  test('user_id must be a number', function(done) {
    var opts = config.fail.useridTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`id` invalid');

      done();
    });
  });
});
