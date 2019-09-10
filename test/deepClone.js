const assert = require('assert');
const { deepClone } = require('..');

const testObject = {
  a: [
    0,
    4,
    '4',
    {
      b: 'hello',
      4: false
    }
  ]
};

const total = 3;
let passes = 0;

try {
  const clone = deepClone(testObject);
  assert.strict.notEqual(clone, testObject);
  passes += 1;
  assert.strict.deepEqual(clone, testObject);
  passes += 1;
  clone.hello = 'world';
  assert.strict.notDeepEqual(clone, testObject);
  passes += 1;
} catch (err) {
  console.error(err);
}

module.exports = [total - passes, total];
