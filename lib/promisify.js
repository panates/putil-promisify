/* putil-promisify
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/putil-promisify/
 */

const Promisify = module.exports = {

  fromCallback: (resolver) => {
    return new Promisify.Promise((resolve, reject) => {
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
  },

  isPromise: (o) => {
    return o &&
        (o instanceof global.Promise || o instanceof Promisify.Promise ||
            (typeof o === 'object' && typeof o.then === 'function' &&
                typeof o.catch === 'function'));
  }

};

Promisify.Promise = global.Promise;
