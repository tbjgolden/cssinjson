const assert = require('assert');
const { inject } = require('..');

const tests = [
  [
    '{i}',
    { i: 'hello' },
    'hello'
    //      ['&r{i}', '-right'],
    //    ['&b{i}', '-bottom']
    //  ],
    //  _: [['{^1}{1}', '{i}rem']]
  ],
  [
    'i am a humble selector',
    undefined,
    'i am a humble selector'
    //      ['&r{i}', '-right'],
    //    ['&b{i}', '-bottom']
    //  ],
    //  _: [['{^1}{1}', '{i}rem']]
  ]
];

let fails = 0;
tests.forEach(([inp1, inp2, expected]) => {
  try {
    assert.strict.deepEqual(
      inject(inp1, inp2),
      expected
    );
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

module.exports = [fails, tests.length];
