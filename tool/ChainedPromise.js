/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
        return function (arg) {
            return arg;
        };
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);
    return function () {
        return rest.reduceRight(function (composed, f) {
            return f(composed);
        }, last.apply(undefined, arguments));
    };
}

/**
 * Since webpack seems to only support a single instance execution.
 * A way to chained webpack tasks which are usually Promise instances is necessary for bundle building.
 * Inspired by Redux, the compose function is used here to generate the Promise chain.
 *
 * @export ChainPromise
 * @module ChainPromise
 * @param {...Function} funcs The functions to create Promise.
 * @return {Promise.<T>|*}
 */
module.exports = function ChainPromise() {
    const promiseChain = Array.prototype.map.call(arguments,
        (promiseCreator) => next => () => (next ? promiseCreator().then(next, next) : promiseCreator())
    );

    return compose.apply(
        /*Generate a function receive a promiseCreator or undefined and return a promiseCreator.*/
        this, promiseChain
    )(
        undefined
        /*Execute the generated function to get a promiseCreator.*/
    )
    (
        /*Execute the generated promiseCreator to start the Promise chain.*/
    ).catch(
        console.log.bind(console)
    );
};