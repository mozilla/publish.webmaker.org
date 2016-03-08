'use strict';

var Lab = require(`lab`);
var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = require(`code`).expect;

var config = require(`../../../lib/fixtures/files`).delete;
var server;

before(done => {
  require(`../../../lib/mocks/server`)(obj => {
    server = obj;

    config((err, del) => {
      if (err) { throw err; }

      config = del;
      done();
    });
  });
});

after(done => {
  server.stop(done);
});

// DELETE /files/:id
experiment(`[Delete a file by id]`, () => {
  test(`success case`, done => {
    var opts = config.success.default;

    // Create, then attempt a delete of a file.
    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(201);

      server.inject({
        url: `/files/` + resp.result.id,
        method: `delete`,
        headers: {
          authorization: `token ag-dubs`
        }
      }, respDel => {
        expect(respDel.statusCode).to.equal(204);

        done();
      });
    });
  });

  test(`file must exist`, done => {
    var opts = config.fail.fileDoesNotExist;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Not Found`);

      done();
    });
  });

  test(`file_id must be a number`, done => {
    var opts = config.fail.fileidTypeError;

    server.inject(opts, resp => {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result).to.exist();
      expect(resp.result.error).to.equal(`Bad Request`);
      expect(resp.result.message).to.equal(`\`id\` invalid`);

      done();
    });
  });
});
