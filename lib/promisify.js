/* putil-promisify
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/putil-promisify/
 */

const Promisify = module.exports = {

  fromCallback: function(resolver) {
    return new Promisify.Promise(function(resolve, reject) {
      try {
        resolver(function(error, value) {
          if (error)
            reject(error);
          else resolve(value);
        });
      } catch (e) {
        reject(e);
      }
    });
  },

  isPromise: function(o) {
    return o && typeof o === 'object' &&
        (o instanceof global.Promise ||
            (typeof o.then === 'function' && typeof o.catch === 'function'));
  }

};

Promisify.Promise = global.Promise;
