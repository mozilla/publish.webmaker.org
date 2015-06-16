var Lab = require('lab');
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require("../../../lib/fixtures/users").getAll;
var server;

before(function(done) {
  require('../../../lib/mocks/server')(function(obj) {
    server = obj;

    done();
  });
});

after(function(done) {
  server.stop(done);
});

// GET /users
experiment('[Get all users]', function() {
  test('success case', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result).to.be.an.array();

      done();
    });
  });
});
