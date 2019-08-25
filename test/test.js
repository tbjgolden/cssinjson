const assert = require('assert');
const parse = require('..');

assert.strict.deepEqual(
  parse([]),
  `hi`
);
