require('colors');

const STAT_METHODS = {
    median: 'median',
    average: 'average'
};
const DEFAULTS = {
    iterations: 100000,
    stat: STAT_METHODS.median
};
const FAULTY_CASES_ERROR = 'The "bench" function expects the first argument to be an array of functions, with at least 2 cases.';

/**
 * Converts a BigInt to a number.
 * @param {BigInt} bigint
 * @returns {Number}
 */
const bigintToNumber = (bigint) => Number(bigint.toString());

/**
 * Measures a single function's average execution time, in nanoseconds accuracy.
 * @param {Function} fn The function to measure.
 * @param {Number} options.iterations The number of iterations to run. Higher iterations account for engine warm up and parsing. Default is 100000.
 * @param {String} options.stat The statistical method to use when looking on the execution result. Can be either "median" or "average". Default is "median".
 * @returns {Number}
 */
const measureCase = (fn, {
    iterations = DEFAULTS.iterations,
    stat = DEFAULTS.stat
} = {}) => {
    let total = BigInt(0);
    let median;
    const medianIndex = Math.floor(iterations / 2);

    for (let i = 0; i < iterations; i++) {
        const start = process.hrtime.bigint();
        fn();
        const end = process.hrtime.bigint();
        const time = end - start;

        total += time;

        if (i === medianIndex) {
            median = time;
            break;
        }
    }

    return stat === STAT_METHODS.median ? median : bigintToNumber(total) / iterations;
};

/**
 * Calculates the difference in percentage between two BigInt numbers.
 * @param {BigInt} a The first operand.
 * @param {BigInt} b The second operand.
 * @returns {String}
 */
const calculatePercentageDiff = (a, b) => {
    a = bigintToNumber(a);
    b = bigintToNumber(b);

    const diff = b - a;
    const percentage = diff / a * 100;

    return percentage.toFixed(2).replace('.00', '');
};

/**
 * Pretty prints the benchmark results to console.
 * @param {Result[]} results The measurement results.
 * @param {String} stat The statistical method to use when looking on the execution result.
 */
const print = (results, stat) => {
    const fastest = results[0].time;

    console.log('Here are your results:\n');

    results.forEach(({ time, index }) => {
        const percentageDiff = calculatePercentageDiff(fastest, time);
        const result = percentageDiff === '0'
            ? 'Fastest 🏆'
            : `${percentageDiff}% slower`;

        console.log(
            `Case ${index} -`,
            `${time}ns`.cyan,
            stat === STAT_METHODS.average ? 'on average' : 'median',
            `(${result})`
        );
    });
};

/**
 * Validates the module's arguments.
 * @param {Function[]} options.cases The different cases to compare.
 * @param {Number} options.iterations The number of iterations to run. Higher iterations account for engine warm up and parsing.
 * @param {String} options.stat The statistical method to use when looking on the execution result.
 */
const validateArgs = ({ cases, stat, iterations }) => {
    if (!Array.isArray(cases) || cases.length < 2) {
        throw new Error(FAULTY_CASES_ERROR);
    }

    if (!STAT_METHODS[stat]) {
        throw new Error(`The stat method provided ("${stat}") is not supported. Supported stat methods are: ${Object.values(STAT_METHODS)}`);
    }

    if (iterations < 50) {
        console.log('Iteration amount provided is less than 50. To get more accurate results, it\'s recommended to iterate at least 50 times\n'.yellow.bold);
    }
};

/**
 * Compares several functions' execution time, and prints the results to the console.
 * @param {Function[]} cases The different cases to compare.
 * @param {Number} options.iterations The number of iterations to run. Higher iterations account for engine warm up and parsing. Default is 100000.
 * @param {String} options.stat The statistical method to use when looking on the execution result. Can be either "median" or "average". Default is "median".
 */
const bench = (cases, {
    iterations = DEFAULTS.iterations,
    stat = DEFAULTS.stat
} = {}) => {
    validateArgs({ cases, iterations, stat });

    const results = cases
        .map((caseFn, index) => {
            if (typeof caseFn !== 'function') {
                throw new Error(FAULTY_CASES_ERROR);
            }

            const time = measureCase(caseFn, {
                iterations,
                stat
            });

            return {
                index: index + 1,
                time
            };
        })
        .sort((a, b) => (a.time > b.time) ? 1 : -1);

        print(results, stat);
};

module.exports = bench;

Object.assign(module.exports, {
    measureCase
});
