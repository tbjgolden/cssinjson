const assert = require('assert');
const { inject } = require('..');

const tests = [
  [
    ['{i}', { i: 'hello' }],
    'hello'
  ],
  [
    ['i am a humble selector'],
    'i am a humble selector'
  ],
  [
    [
      [['{var}', 'it works deep thru arrays too']],
      { var: 'suppose' }
    ],
    [['suppose', 'it works deep thru arrays too']]
  ],
  [
    [
      '{1}{^1}{0}{^0}',
      { _: [['a', 'b'], ['c', 'd']] },
      false
    ],
    'dbca'
  ],
  [
    [
      '.&selector',
      { _: [['expanded-']] },
      true
    ],
    '.expanded-selector'
  ]
];

global.hi = true;
let fails = 0;
tests.forEach(([args, expected]) => {
  try {
    assert.strict.deepEqual(
      inject(...args),
      expected
    );
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});
global.hi = false;

module.exports = [fails, tests.length];
