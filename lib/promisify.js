/* putil-promisify
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/putil-promisify/
 */

const promisify = function(fn) {
  return new Promise((resolve, reject) => {
    try {
      const o = fn();
      if (promisify.isPromise(o)) {
        o.then(v => resolve(v))
            .catch((e) => reject(e));
      } else resolve(o);
    } catch (e) {
      reject(e);
    }
  });
};

promisify.fromCallback = function(resolver) {
  return new promisify.Promise((resolve, reject) => {
    try {
      resolver((error, value) => {
        if (error)
          reject(error);
        else resolve(value);
      });
    } catch (e) {
      reject(e);
    }
  });
};

promisify.isPromise = function(o) {
  return o &&
      (o instanceof global.Promise || o instanceof promisify.Promise ||
          (typeof o === 'object' && typeof o.then === 'function' &&
              typeof o.catch === 'function'));
};

promisify.Promise = global.Promise;

module.exports = promisify;
