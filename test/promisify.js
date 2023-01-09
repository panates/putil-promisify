const assert = require('assert');
const promisify = require('../');

describe('promisify', function() {

  function resolveFn(val1, callback) {
    callback(undefined, val1);
  }

  function rejectFn(val1, callback) {
    callback(new Error('test'), val1);
  }

  it('should return resolved promise when callback return a value', function() {
    const promise = promisify(() => 5);
    assert.ok(promise instanceof Promise);
    return promise.then((result) => {
      assert.strictEqual(result, 5);
    });
  });

  it('should return resolved promise when callback returns resolved promise', function() {
    const promise = promisify(() => Promise.resolve(5));
    assert.ok(promise instanceof Promise);
    return promise.then((result) => {
      assert.strictEqual(result, 5);
    });
  });

  it('should return rejected promise when callback throws error', function() {
    const promise = promisify(() => {
      throw new Error('Any error');
    });
    assert.ok(promise instanceof Promise);
    return assert.rejects(() => promise);
  });

  it('should return rejected promise callback returns rejected promise', function() {
    const promise = promisify(() => {
      return Promise.reject(new Error('Any error'));
    });
    assert.ok(promise instanceof Promise);
    return assert.rejects(() => promise);
  });

  it('should return back the given promise', function() {
    const promise = promisify(Promise.resolve(1));
    assert.ok(promise instanceof Promise);
    return promise.then((result) => {
      assert.strictEqual(result, 1);
    });
  });

  it('should return resolved promise when argument not a function', function() {
    const promise = promisify(5);
    assert.ok(promise instanceof Promise);
    return promise.then((result) => {
      assert.strictEqual(result, 5);
    });
  });

  it('should resolve', function() {
    const promise = promisify.fromCallback((cb) => {
      resolveFn(5, cb);
    });
    return promise.then(function(result) {
      assert.strictEqual(result, 5);
    });
  });

  it('should reject', function() {
    return assert.rejects(() => promisify.fromCallback((cb) => {
      rejectFn(5, cb);
    }));
  });

  it('should return isPromise(promise) === true', function() {
    assert.ok(promisify.isPromise(Promise.resolve(1)));
  });

  it('should return isPromise(externalPromise) === true', function() {
    assert.ok(promisify.isPromise({
      then: () => {},
      catch: () => {}
    }));
  });

  it('should return isPromise(!promise) === false', function() {
    assert.ok(!promisify.isPromise({}));
  });

  it('should deep resolve promises', function() {
    return promisify.deepResolve({
      a: {
        b: Promise.resolve(1),
        d: [Promise.resolve(3), 4]
      },
      c: Promise.resolve(2),
      e: 5,
      f: null
    }).then((o) => {
      assert.deepStrictEqual(o, {a: {b: 1, d: [3, 4]}, c: 2, e: 5, f: null});
    });
  });

  it('should deepResolve ignore circular references', function() {
    const a = {
      b: Promise.resolve(1),
      d: [Promise.resolve(3), 4]
    };
    const b = {a};
    const obj = {
      a,
      b
    };
    return promisify.deepResolve(obj).then((o) => {
      assert.deepStrictEqual(o, {
        a: {b: 1, d: [3, 4]},
        b: {a: {b: 1, d: [3, 4]}}
      });
    });
  });

  it('should wait() create a promise that resolve at given ms later', async function() {
    const t = Date.now();
    await promisify.wait(250);
    assert.ok(Date.now() - t >= 250);
  });

  it('should await() resolve promise and call the callback', (done) => {
    const promise = Promise.resolve(1);
    promisify.await(promise, done);
  });

  it('should await() ignore errors if no callback given', function(done) {
    const promise = Promise.reject(new Error());
    promisify.await(promise)
        .then(() => done());
  });

  it('should await() call callback if arguments is not a promise', function(done) {
    promisify.await(1, done);
  });


});
