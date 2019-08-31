const assert = require('assert');
const nCSS = require('..').default;

const tests = [
  [
    [
      {
        i: [0, 1],
        _: {
          $: [['.m', 'margin']],
          _: [
            {
              $: [['{i}']],
              _: [
                ['{^1}', '{i}rem']
              ]
            },
            {
              $: [
                ['l{i}', '-left'],
                ['r{i}', '-right']
              ],
              _: [
                ['{^1}{1}', '{i}rem']
              ]
            }
          ]
        }
      }
    ],
    `.m0 { margin: 0rem }
.ml0 { margin-left: 0rem }
.mr0 { margin-right: 0rem }
.m1 { margin: 1rem }
.ml1 { margin-left: 1rem }
.mr1 { margin-right: 1rem }`
  ],
  [
    `[{"i":[0,1],"_":{"$":[[".m","margin"]],"_":[{"$":[["{i}"]],"_":[["{^1}","{i}rem"]]},{"$":[["l{i}","-left"],["r{i}","-right"]],"_":[["{^1}{1}","{i}rem"]]}]}}]`,
    `.m0 { margin: 0rem }
.ml0 { margin-left: 0rem }
.mr0 { margin-right: 0rem }
.m1 { margin: 1rem }
.ml1 { margin-left: 1rem }
.mr1 { margin-right: 1rem }`
  ]
];

let fails = 0;
tests.forEach(([input, expected]) => {
  try {
    assert.strict.deepEqual(
      nCSS(input),
      expected
    );
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

module.exports = [fails, tests.length];
