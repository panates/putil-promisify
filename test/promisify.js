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

    const promise = Promisify.fromCallback(function(cb) {
      resolveFn(5, cb);
    });

    promise.then(function(result) {
      assert.equal(result, 5);
      done();
    }).catch(function(e) {
      assert.ok(0, e);
      done();
    });
  });

  it('should reject', function(done) {

    const promise = Promisify.fromCallback(function(cb) {
      rejectFn(5, cb);
    });

    promise.then(function(result) {
      done(new Error('Failed'));
    }).catch(function(e) {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {

    const promise = Promisify.fromCallback(function(cb) {
      resolveFn(5, cb);
    });

    promise.then(function(result) {
      assert.equal(result, 6);
      done();
    }).catch(function(e) {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {
    const promise = Promisify.fromCallback(function(cb) {
      throw new Error('test');
    });

    promise.then(function(result) {
      done(new Error('Failed'));
    }).catch(function(e) {
      assert.ok(1, e);
      done();
    });
  });

  it('should return isPromise(promise) === true', function(done) {
    assert.ok(Promisify.isPromise(new Promise(function() {})));
    done();
  });

  it('should return isPromise(externalPromise) === true', function(done) {
    assert.ok(Promisify.isPromise({
      then: function() {
      },
      catch: function() {
      }
    }));
    done();
  });

  it('should return isPromise(!promise) === false', function(done) {
    assert.ok(!Promisify.isPromise({}));
    done();
  });

});