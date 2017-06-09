/* eslint-disable */
const assert = require('assert'),
    Promisify = require('../');

describe('promisify', function() {

  function resolveFn(val1, callback) {
    callback(undefined, val1);
  }

  function rejectFn(val1, callback) {
    callback(new Error('test'), val1);
  }

  it('should resolve', function(done) {

    let promise = Promisify.fromCallback(cb => {
      resolveFn(5, cb);
    });

    promise.then(result => {
      assert.equal(result, 5);
      done();
    }).catch(e => {
      assert.ok(0, e);
      done();
    });
  });

  it('should reject', function(done) {

    let promise = Promisify.fromCallback(cb => {
      rejectFn(5, cb);
    });

    promise.then(result => {
      done(new Error('Failed'));
    }).catch(e => {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {

    let promise = Promisify.fromCallback(cb => {
      resolveFn(5, cb);
    });

    promise.then(result => {
      assert.equal(result, 6);
      done();
    }).catch(e => {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {

    let promise = Promisify.fromCallback(cb => {
      throw new Error('test');
    });

    promise.then(result => {
      done(new Error('Failed'));
    }).catch(e => {
      assert.ok(1, e);
      done();
    });
  });

});