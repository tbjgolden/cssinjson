const assert = require('assert');
const { flatRulesToCSS } = require('..');

const tests = [
  [
    [
      ['.some-class', [
        ['color', 'blue'],
        ['background', 'white'],
        ['box-shadow', '1px 1px 1px 1px #000'],
        ['font-weight', 'bold']
      ]]
    ],
    `.some-class { color: blue; background: white; box-shadow: 1px 1px 1px 1px #000; font-weight: bold }`
  ],
  [
    [
      ['.blue', [['color', 'blue']]],
      ['.m0', [['margin', '0rem']]],
      ['.mt0', [['margin-top', '0rem']]],
      ['.ml0', [['margin-left', '0rem']]],
      ['.mr0', [['margin-right', '0rem']]],
      ['.mb0', [['margin-bottom', '0rem']]],
      ['.btn', [
        ['background', 'red'],
        ['color', 'white'],
        ['text-align', 'center']
      ]]
    ],
    `.blue { color: blue }
.m0 { margin: 0rem }
.mt0 { margin-top: 0rem }
.ml0 { margin-left: 0rem }
.mr0 { margin-right: 0rem }
.mb0 { margin-bottom: 0rem }
.btn { background: red; color: white; text-align: center }`
  ]
];

let fails = 0;
tests.forEach(([input, expected]) => {
  try {
    assert.strict.deepEqual(
      flatRulesToCSS(input),
      expected
    );
  } catch (err) {
    fails += 1;
    console.error(err);
  }
});

module.exports = [fails, tests.length];
