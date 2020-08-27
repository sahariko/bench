const bench = require('.');

bench([
    () => false,
    () => 1 + 1 + 1
], { iterations: 10 });
