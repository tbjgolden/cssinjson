const assert = require('assert');
const { flatten } = require('..');

const tests = [
  [
    [
      ['.blue', [['color', 'blue']]],
      {
        i: [0, 1, 2, 3, 4],
        _: [
          {
            $: [['.m', 'margin'], ['.p', 'padding']],
            _: [
              {
                $: [['{i}']],
                _: [['{^1}', '{i}rem']]
              },
              {
                $: [
                  ['t{i}', '-top'],
                  ['l{i}', '-left'],
                  ['&r{i}', '-right'],
                  ['&b{i}', '-bottom']
                ],
                _: [['{^1}{1}', '{i}rem']]
              }
            ]
          }
        ]
      }
    ],
    [
      ['.blue', [['color', 'blue']]],
      ['.m0', [['margin', '0rem']]],
      ['.mt0', [['margin-top', '0rem']]],
      ['.ml0', [['margin-left', '0rem']]],
      ['.mr0', [['margin-right', '0rem']]],
      ['.mb0', [['margin-bottom', '0rem']]],
      ['.p0', [['padding', '0rem']]],
      ['.pt0', [['padding-top', '0rem']]],
      ['.pl0', [['padding-left', '0rem']]],
      ['.pr0', [['padding-right', '0rem']]],
      ['.pb0', [['padding-bottom', '0rem']]],
      ['.m1', [['margin', '1rem']]],
      ['.mt1', [['margin-top', '1rem']]],
      ['.ml1', [['margin-left', '1rem']]],
      ['.mr1', [['margin-right', '1rem']]],
      ['.mb1', [['margin-bottom', '1rem']]],
      ['.p1', [['padding', '1rem']]],
      ['.pt1', [['padding-top', '1rem']]],
      ['.pl1', [['padding-left', '1rem']]],
      ['.pr1', [['padding-right', '1rem']]],
      ['.pb1', [['padding-bottom', '1rem']]],
      ['.m2', [['margin', '2rem']]],
      ['.mt2', [['margin-top', '2rem']]],
      ['.ml2', [['margin-left', '2rem']]],
      ['.mr2', [['margin-right', '2rem']]],
      ['.mb2', [['margin-bottom', '2rem']]],
      ['.p2', [['padding', '2rem']]],
      ['.pt2', [['padding-top', '2rem']]],
      ['.pl2', [['padding-left', '2rem']]],
      ['.pr2', [['padding-right', '2rem']]],
      ['.pb2', [['padding-bottom', '2rem']]],
      ['.m3', [['margin', '3rem']]],
      ['.mt3', [['margin-top', '3rem']]],
      ['.ml3', [['margin-left', '3rem']]],
      ['.mr3', [['margin-right', '3rem']]],
      ['.mb3', [['margin-bottom', '3rem']]],
      ['.p3', [['padding', '3rem']]],
      ['.pt3', [['padding-top', '3rem']]],
      ['.pl3', [['padding-left', '3rem']]],
      ['.pr3', [['padding-right', '3rem']]],
      ['.pb3', [['padding-bottom', '3rem']]],
      ['.m4', [['margin', '4rem']]],
      ['.mt4', [['margin-top', '4rem']]],
      ['.ml4', [['margin-left', '4rem']]],
      ['.mr4', [['margin-right', '4rem']]],
      ['.mb4', [['margin-bottom', '4rem']]],
      ['.p4', [['padding', '4rem']]],
      ['.pt4', [['padding-top', '4rem']]],
      ['.pl4', [['padding-left', '4rem']]],
      ['.pr4', [['padding-right', '4rem']]],
      ['.pb4', [['padding-bottom', '4rem']]]
    ]
  ]
];

let fails = 0;
tests.forEach(([input, expected]) => {
  try {
    assert.strict.deepEqual(flatten(input), expected);
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

module.exports = [fails, tests.length];
