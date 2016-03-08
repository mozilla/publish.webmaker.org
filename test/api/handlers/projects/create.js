'use strict';

var Lab = require(`lab`);
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require(`code`).expect;

var config = require(`../../../lib/fixtures/projects`).create;
var server;

before(done => {
  require(`../../../lib/mocks/server`)(obj => {
    server = obj;

    config((err, create) => {
      if (err) { throw err; }

      config = create;
      done();
    });
  });
});

after(done => {
  server.stop(done);
});

function cleanup(id, callback) {
  server.inject({
    url: `/projects/` + id,
    method: `delete`,
    headers: {
      authorization: `token ag-dubs`
    }
  }, resp => {
    expect(resp.statusCode).to.equal(204);
    callback();
  });
}

function assertValidResponse(res) {
  expect(res).to.exist();
  expect(res.id).to.be.a.number();
  expect(res.user_id).to.be.a.number();
  expect(res.date_created).to.be.a.string();
  expect(res.date_updated).to.be.a.string();
  expect(res.title).to.be.a.string();
  expect(res.tags).to.be.a.string();
  expect(res.readonly).to.be.a.boolean();
  expect(res.client).to.be.a.string();
}

// POST /projects
experiment(`[Create a project]`, () => {
  test(`success case`, done => {
    var opts = config.success.default;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(201);
      assertValidResponse(resp.result);
      cleanup(resp.result.id, done);
    });
  });

  test(`associated user must exist`, done => {
    var opts = config.fail.userDoesNotExist;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(401);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Unauthorized`);

      done();
    });
  });

  test(`user_id must be a valid type`, done => {
    var opts = config.fail.useridTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`user_id\` invalid`);

      done();
    });
  });

  test(`title must be a valid type`, done => {
    var opts = config.fail.titleTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`title\` invalid`);

      done();
    });
  });

  test(`date_created may not exist`, done => {
    var opts = config.fail.dateCreatedAbsent;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(201);
      assertValidResponse(resp.result);
      cleanup(resp.result.id, done);
    });
  });

  test(`date_updated may not exist`, done => {
    var opts = config.fail.dateUpdatedAbsent;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(201);
      assertValidResponse(resp.result);
      cleanup(resp.result.id, done);
    });
  });

  test(`date_created must be a valid type`, done => {
    var opts = config.fail.dateCreatedTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`date_created\` invalid`);

      done();
    });
  });

  test(`date_updated must be a valid type`, done => {
    var opts = config.fail.dateUpdatedTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`date_updated\` invalid`);

      done();
    });
  });

  test(`description must be a valid type`, done => {
    var opts = config.fail.descriptionTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`description\` invalid`);

      done();
    });
  });

  test(`tags must be a valid type`, done => {
    var opts = config.fail.tagsTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`tags\` invalid`);

      done();
    });
  });

  test(`user_id must exist`, done => {
    var opts = config.fail.useridAbsent;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`user_id\` must be passed.`);

      done();
    });
  });

  test(`title must exist`, done => {
    var opts = config.fail.titleAbsent;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`title\` must be passed.`);

      done();
    });
  });
});

