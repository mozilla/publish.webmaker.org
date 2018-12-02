var Lab = require('lab');
var lab = exports.lab = Lab.script();
var db = require('../../../lib/db');
var utils = require('../../../lib/utils');

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require('../../../lib/fixtures/files').create;
var server;

before(function(done) {
  require('../../../lib/mocks/server')(function(obj) {
    server = obj;

    config(function(err, create) {
      if (err) { throw err; }

      config = create;
      done();
    });
  });
});

after(function(done) {
  server.stop(done);
});

// POST /files
experiment('[Create a file]', function() {
  test('success case', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(201);
      expect(resp.result).to.exist();
      expect(resp.result.id).to.be.a.number();
      expect(resp.result.project_id).to.be.a.number();
      expect(resp.result.path).to.be.a.string();
      expect(resp.result.buffer).not.to.exist();

      db('files')
      .where('id', resp.result.id)
      .del()
      .then(() => done());
    });
  });

  test('success case updates instead of creates if exists', function(done) {
    var opts = config.success.update;
    var newPayload = opts.recreate;
    var result1, result2;

    server.inject(opts.initial, function(resCreate) {
      expect(resCreate.statusCode).to.equal(201);

      result1 = resCreate.result;

      expect(result1).to.exist();
      expect(result1.id).to.be.a.number();
      expect(result1.project_id).to.be.a.number();
      expect(result1.path).to.be.a.string();
      expect(result1.buffer).not.to.exist();

      var id = result1.id;

      server.inject(opts.recreate, function(resUpdate) {
        expect(resUpdate.statusCode).to.equal(200);

        result2 = resUpdate.result;

        expect(result2).to.exist();
        expect(result2.id).to.equal(id);
        expect(result2.project_id).to.equal(result1.project_id);
        expect(result2.path).to.equal(result1.path);
        expect(result2.buffer).not.to.exist();

        db('files')
        .where({
          project_id: result2.project_id,
          path: result2.path
        })
        .select('id')
        .then(function(files) {
          expect(files).to.exist();
          expect(files).to.have.length(1);

          db('files')
          .where('id', id)
          .del()
          .then(() => done());
        });
      });
    });
  });

  test('associated project must exist', function(done) {
    var opts = config.fail.projectDoesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Not Found');

      done();
    });
  });

  test('project_id must be a valid type', function(done) {
    var opts = config.fail.projectidTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`project_id` invalid');

      done();
    });
  });

  test('project_id must exist', function(done) {
    var opts = config.fail.projectidAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`project_id` must be passed.');

      done();
    });
  });

  test('path must exist', function(done) {
    var opts = config.fail.pathAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`path` must be passed.');

      done();
    });
  });

  test('buffer must exist', function(done) {
    var opts = config.fail.dataAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`buffer` must be passed.');

      done();
    });
  });
});
