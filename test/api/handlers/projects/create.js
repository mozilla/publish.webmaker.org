var Lab = require('lab');
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require('code').expect;

var config = require('../../../lib/fixtures/projects').create;
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

// POST /projects
experiment('[Create a project]', function() {
  test('success case', function(done) {
    var opts = config.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(201);
      expect(resp.result).to.exist();
      expect(resp.result.id).to.be.a.number();
      expect(resp.result.user_id).to.be.a.number();
      expect(resp.result.date_created).to.be.a.string();
      expect(resp.result.date_updated).to.be.a.string();
      expect(resp.result.title).to.be.a.string();
      expect(resp.result.tags).to.be.a.string();

      server.inject({
        url: '/projects/' + resp.result.id,
        method: 'delete',
        headers: {
          authorization: 'token ag-dubs'
        }
      }, function (resp) {
        expect(resp.statusCode).to.equal(204);
        done();
      });
    });
  });

  test('associated user must exist', function(done) {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Not Found');

      done();
    });
  });

  test('user_id must be a valid type', function(done) {
    var opts = config.fail.useridTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`user_id` invalid');

      done();
    });
  });

  test('title must be a valid type', function(done) {
    var opts = config.fail.titleTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`title` invalid');

      done();
    });
  });

  test('date_created must be a valid type', function(done) {
    var opts = config.fail.dateCreatedTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`date_created` invalid');

      done();
    });
  });

  test('date_updated must be a valid type', function(done) {
    var opts = config.fail.dateUpdatedTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`date_updated` invalid');

      done();
    });
  });


  test('description must be a valid type', function(done) {
    var opts = config.fail.descriptionTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`description` invalid');

      done();
    });
  });

  test('tags must be a valid type', function(done) {
    var opts = config.fail.tagsTypeError;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`tags` invalid');

      done();
    });
  });

  test('user_id must exist', function(done) {
    var opts = config.fail.useridAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`user_id` must be passed.');

      done();
    });
  });

  test('title must exist', function(done) {
    var opts = config.fail.titleAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`title` must be passed.');

      done();
    });
  });

  test('date_created must exist', function(done) {
    var opts = config.fail.dateCreatedAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`date_created` must be passed.');

      done();
    });
  });

  test('date_updated must exist', function(done) {
    var opts = config.fail.dateUpdatedAbsent;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('`date_updated` must be passed.');

      done();
    });
  });
});

