/* eslint-disable */
const assert = require('assert'),
    Promisify = require('../');

describe('promisify', function() {

  function callbackFunction(val1, callback) {
    callback(undefined, val1);
  }

  it('should success', function(done) {

    let promise = Promisify.fromCallback(cb => {
      callbackFunction(5, cb);
    });

    promise.then(result => {
      assert.equal(result, 5);
      done();
    }).catch(e => {
      assert.ok(0, e);
      done();
    });
  });

  it('should catch', function(done) {

    let promise = Promisify.fromCallback(cb => {
      callbackFunction(5, cb);
    });

    promise.then(result => {
      assert.equal(result, 6);
      done();
    }).catch(e => {
      assert.ok(1, e);
      done();
    });
  });

});