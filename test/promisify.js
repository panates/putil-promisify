/* eslint-disable */
const assert = require('assert');
const promisify = require('../');
const {rejects, doesNotReject} = require('rejected-or-not');

assert.rejects = assert.rejects || rejects;
assert.doesNotReject = assert.doesNotReject || doesNotReject;

describe('promisify', function() {

  function resolveFn(val1, callback) {
    callback(undefined, val1);
  }

  function rejectFn(val1, callback) {
    callback(new Error('test'), val1);
  }

  it('should return resolved promise when callback return a value', function() {

    const promise = promisify(() => {
      return 5;
    });

    assert(promise instanceof Promise);
    promise.then((result) => {
      assert.strictEqual(result, 5);
    });
  });

  it('should return resolved promise when callback returns resolved promise', function() {

    const promise = promisify(() => {
      return Promise.resolve(5);
    });

    assert(promise instanceof Promise);
    promise.then((result) => {
      assert.strictEqual(result, 5);
    });
  });

  it('should return rejected promise when callback throws error', function() {
    const promise = promisify(() => {
      throw new Error('Any error');
    });
    assert(promise instanceof Promise);
    assert.rejects(promise);
  });

  it('should return rejected promise callback returns rejected promise', function() {
    const promise = promisify(() => {
      return Promise.reject(new Error('Any error'));
    });
    assert(promise instanceof Promise);
    assert.rejects(promise);
  });

  it('should resolve', function(done) {

    const promise = promisify.fromCallback((cb) => {
      resolveFn(5, cb);
    });

    promise.then(function(result) {
      assert.strictEqual(result, 5);
      done();
    }).catch(function(e) {
      assert.ok(0, e);
      done();
    });
  });

  it('should reject', function(done) {

    const promise = promisify.fromCallback((cb) => {
      rejectFn(5, cb);
    });

    promise.then(function() {
      done(new Error('Failed'));
    }).catch((e) => {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {

    const promise = promisify.fromCallback(function(cb) {
      resolveFn(5, cb);
    });

    promise.then(function(result) {
      assert.strictEqual(result, 6);
      done();
    }).catch((e) => {
      assert.ok(1, e);
      done();
    });
  });

  it('should catch', function(done) {
    const promise = promisify.fromCallback(() => {
      throw new Error('test');
    });

    promise.then(() => {
      done(new Error('Failed'));
    }).catch((e) => {
      assert.ok(1, e);
      done();
    });
  });

  it('should return isPromise(promise) === true', function(done) {
    assert.ok(promisify.isPromise(new Promise(() => {})));
    done();
  });

  it('should return isPromise(externalPromise) === true', function(done) {
    assert.ok(promisify.isPromise({
      then: () => {},
      catch: () => {}
    }));
    done();
  });

  it('should return isPromise(!promise) === false', function(done) {
    assert.ok(!promisify.isPromise({}));
    done();
  });

});
