var Lab = require('lab');
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require("../../../lib/fixtures/files").getOne;
var server;

before(function(done) {
  require('../../../lib/mocks/server')(function(obj) {
    server = obj;

    config(function(err, getOne) {
      if (err) throw err;

      config = getOne;
      done();
    });
  });
});

after(function(done) {
  server.stop(done);
});

// GET /user/:userid/projects/:projectid/files/:fileid
experiment('[Get one file]', function() {
  experiment('[Parameter errors]', function() {
    test('user_id must be valid', function(done) {
      var opts = config.fail.invalidUserid;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result).to.exist;
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();

        done();
      });
    });

    test('project_id must be valid', function(resp) {
      var opts = config.fail.invalidProjectid;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result).to.exist;
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();

        done();
      });
    });

    test('file_id must be valid', function(resp) {
      var opts = config.fail.invalidFileid;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result).to.exist;
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();

        done();
      });
    });
  });

  experiment('Postgres errors', function() {
    // This might not be the place for this. Tests
    // for the reponse if a postgres error occurs
    // on this route should appear here. We can stub
    // the postgres handler with sinon.

    // See: https://github.com/mozilla/api.webmaker.org/blob/develop/test/services/api/handlers/projects.js#L37-L38
  });

  test('default', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result).to.exist();
      expect(resp.result.file).to.exist();
      expect(resp.result.file.path).to.be.a.string();
      expect(resp.result.file.size).to.be.a.number();
      expect(resp.result.file.data).to.be.a.buffer();

      done();
    });
  });
});
