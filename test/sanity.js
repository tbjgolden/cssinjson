const assert = require('assert');
const { expand } = require('..');

const pairs = [
  [
    [
      ['.blue', [['color', 'blue']]],
      {
        i: [0, 1, 2, 3, 4],
        _: {
          $: [['.m', 'margin'], ['.p', 'padding']],
          _: [
            {
              $: [['{i}']],
              _: [
                ['{^1}', '{i}rem']
              ]
            },
            {
              $: [
                ['t{i}', '-top'],
                ['l{i}', '-left'],
                ['&r{i}', '-right'],
                ['&b{i}', '-bottom']
              ],
              _: [
                ['{^1}{1}', '{i}rem']
              ]
            }
          ]
        }
      }
    ],
    [
      ['.blue', [['color', 'blue']]],
      {
        i: [0, 1, 2, 3, 4],
        _: {
          $: [['.m', 'margin'], ['.p', 'padding']],
          _: {
            $: [
              ['{i}', ''],
              ['t{i}', '-top'],
              ['l{i}', '-left'],
              ['r{i}', '-right'],
              ['b{i}', '-bottom']
            ],
            _: [
              ['{^1}{1}', '{i}rem']
            ]
          }
        }
      }
    ]
  ]
];

let tests = 0;
let fails = 0;

// check outputs don't need unique inputs
pairs.forEach(([a, b]) => {
  tests += 1;
  try {
    assert.strict.deepEqual(expand(a), expand(b), 'inputs did not generate same output');
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

// check outputs are consistent
pairs.forEach(pair => {
  tests += 1;
  try {
    pair.forEach(input => {
      const N = 100;

      const flattened = new Array(N).fill(0)
        .map(_ => expand(JSON.parse(JSON.stringify(input))));

      for (let i = 1; i < N; i++) {
        assert.strict.deepEqual(flattened[i - 1], flattened[i], 'inconsistent output');
      }
    });
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

// check input is not mutated
pairs.forEach(pair => {
  tests += 1;
  try {
    pair.forEach(input => {
      const _input = JSON.parse(JSON.stringify(input));
      const $input = input;
      expand(input);
      assert.strict.deepEqual(input, _input, 'expand() is impure');
      assert.strict.equal(input, $input, 'expand() is impure');
    });
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

module.exports = [fails, tests];
