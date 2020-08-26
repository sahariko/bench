# bench

Run JS benchmarks with nanoseconds accuracy.

- [Installation](#installation)
- [API](#api)
    * [`bench(cases, options)`](#globalscope-object)
    * [`measureCase(fn, options)`](#globalscope-object)

## Installation

```
npm i @cocopina/bench
```

## API

### `bench(cases, options)`

The package's default export.

Use this to run a full benchmark suite (including result printing and all), you can use the package's default export.

#### Arguments

- `cases <Function[]>` - The different cases to compare.
- `options <Object>`
    - `iterations <Number>` - The number of iterations to run. Higher iterations account for engine warm up and parsing. Default is `100000`.
    - `stat <String>` - The statistical method to use when looking on the execution result. Can be either `"median"` or `"average"`<sup>1</sup>. Default is `"median"`.

> It's highly recommended to use median and/or a large amount of iterations when measuring performance to compensate for engine warmup, etc.

#### Example

```js
const bench = require('@cocopina/bench');

bench([
    () => false,
    () => 1 + 1 + 1
]);

// Here are your results:
//
// Case 2 - 278ns median (Fastest 🏆)
// Case 1 - 433ns median (55.76% slower)
```

### `measureCase(fn, options)`

Measures a single function's average execution time, in nanoseconds accuracy.

Use this to get only the execution time of a given function.

#### Arguments

- `fn <Function>` - The function to measure.
- `options <Object>`
    - `iterations <Number>` - The number of iterations to run. Higher iterations account for engine warm up and parsing. Default is `100000`.
    - `stat <String>` - The statistical method to use when looking on the execution result. Can be either `"median"` or `"average"`<sup>1</sup>. Default is `"median"`.

> It's highly recommended to use median and/or a large amount of iterations when measuring performance to compensate for engine warmup, runtime code parsing to byte code, etc.

#### Returns

`Number`

#### Example

```js
const { measureCase } = require('@cocopina/bench');

measureCase(() => false); // 253
```
