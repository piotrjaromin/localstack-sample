'use strict';

const Promise = require('bluebird');

/**
 * calls assertFn up to maxTries at interval breaks, function is retried when promise returned by assertFn throws error
 * @param {*} assertFn functions which returns promise
 * @param {options} options to control retry functionality
 * @param {options.interval} interval at which retires should be performed
 * @param {options.maxTries} maxTries max count of retries to perform
 * @return {function}
 */
function retry(assertFn, {maxTries = 4, interval = 200} = {}) {
    const tryer = currentTry => assertFn()
        .catch((err) => {
            if (currentTry < maxTries) {
                return Promise
                    .delay(interval)
                    .then(() => tryer(currentTry + 1));
            }

            throw err;
        });

    return tryer(0);
}


module.exports = {
    retry,
};
