'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable no-self-compare */

const varRegex = /\{(\^*)([0-9a-z]+)\}/i;
const ampRegex = /&/g;

// Helpers
const isArray = Array.isArray;
function isNaN (n) { return n !== n; }
function type (x, s) { s = s || 's'; return (typeof x)[0] === s; }
function array (o) { return isArray(o) ? o : [o]; }
function concatAll (xs) { return xs.reduce((l, x) => l.concat(x), []); }

/**
 * Generates a CSS string from a nanoCSS object
 * @param {Object|Array|String} input - source nanoCSS as JSON string or object
 * @param {Object} [vars={_:[]}] - extra variables that can be used in compilation
 * @return {String} CSS - the CSS generated from the nanoCSS object, as a string
 */
function nanoCSS (input, vars, root) {
  return generate(expand(input, vars, root));
}

/**
 * Expands a nanoCSS object into a flattened set of rules
 * @param {Object|Array|String} input - source nanoCSS as JSON (string or object)
 * @return {Array} the corresponding flattened set of rules
 */
function expand (input, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;

  if (type(input)) input = JSON.parse(input);

  let stylesheet = [];

  if (isArray(input)) {
    if (type(input[0])) return inject(input, vars);
    // basic loop
    for (let i = 0; i < input.length; i++) {
      stylesheet[i] = expand(input[i], vars, false);
    }
  } else if (input.$) {
    // nested loop
    const indirect = [];
    const direct = {};

    for (let i = 0; i < input.$.length; i++) {
      const sel = inject(input.$[i][0], vars);
      const newVars = deepClone(vars, {
        _: vars._.concat([input.$[i]])
      });
      const val = expand(array(input._), newVars, false);
      const pair = val.reduce((pair, input) => {
        pair[~~isPropVal(input)].push(input);
        return pair;
      }, [[], []]);
      indirect.push.apply(
        indirect,
        concatAll(pair[0])
      );
      if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
    }

    stylesheet = Object.entries(direct).concat(indirect);
  } else {
    // variable loop
    let combos = [vars];

    Object.keys(input)
      .forEach(k => {
        if (k === '_') return;

        if (type(input[k])) input[k] = range(input[k]);

        combos = concatAll(
          input[k]
            .map(v => (
              combos.map(c => {
                c = deepClone(c);
                c[k] = v;
                return c;
              })
            ))
        );
      });
    for (let i = 0; i < combos.length; i++) {
      stylesheet[i] = expand(array(input._), combos[i], false);
    }
  }

  return root ? flat(stylesheet) : stylesheet;
}

/**
 * Generates a CSS string from a flattened set of rules
 * @param {Array} flatRules - the flattened representation of a stylesheet
 * @return {String} CSS - the CSS generated from the rules, as a string
 */
function generate (flatRules) {
  return flatRules
    .map(pair => `${pair[0]} { ${
      pair[1]
        .map(pair => (
          isArray(pair[1])
            ? generate([pair])
            : `${pair[0]}: ${pair[1]}`
        ))
        .join('; ')
    } }`)
    .join('\n');
}

/**
 * Replaces all instances of variable syntax in an object with their values
 * @param {*} value - value to check for variable syntax
 * @param {Object} [vars={_:[]}] - object to clone into (persists own keys)
 * @return {Array|String} value with all variable syntax replaced by values
 */
function inject (value, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;

  if (isArray(value)) return value.map(x => inject(x, vars, false));

  value += '';
  let match = value.match(varRegex);

  while (match) {
    const index = vars._.length - match[1].length - 1;
    const n = parseInt(match[2]);
    // checks if arg name is an integer and if it's for a valid ancestor index
    /* eslint-disable-next-line no-self-compare */
    const k = (n === n && index >= 0) ? n : match[2];
    value = value.replace(match[0], (type(k, 'n') ? vars._[index] : vars)[k]);
    match = value.match(varRegex);
  }

  if (root && vars._.length) {
    const sel = vars._[vars._.length - 1][0];
    return ~value.indexOf('&') ? value.replace(ampRegex, sel) : `${sel}${value}`;
  }

  return value;
}

/**
 * A fast and small deep clone algorithm
 * @param {Object} obj - object to deep clone
 * @param {Object} [clone={}] - object to clone into (persists own keys)
 * @return {Object}
 */
function deepClone (obj, clone) {
  clone = clone || {};
  for (let k in obj) {
    const o = obj[k];
    clone[k] = clone[k] || ((o && type(o, 'o')) ? deepClone(o.constructor(), o) : o);
  }
  return clone;
}

/**
 * Determines if an array is a valid property value pair.
 * @private
 * @param  {Array} arr - array to check.
 * @return {Boolean}
 */
function isPropVal (x) { return type(x[0]) && type(x[1]); }

/**
 * Determines if an array is a valid simple rule, a valid nested rule, or neither.
 * @private
 * @param {Array} arr - array to check.
 * @return {Boolean|Number} 1 if a leaf rule, 2 if it contains rules, false otherwise
 **/
function isRule (arr) {
  if (!type(arr[0]) || !isArray(arr[1])) return false;
  let c = 1;
  for (let i = 0; i < arr[1].length; i++) {
    if (!isPropVal(arr[1][i])) c = 2;
  }
  return c;
}

/**
 * A function which reduces an expanded stylesheet to its simplest form.
 * @private
 * @param {Array} arr - array to flatten.
 * @return {Array}
 **/
function flat (arr) {
  const c = isRule(arr);
  if (c === 2) arr[1] = flat(arr[1]);
  return c ? [arr] : concatAll(arr.map(child => flat(child)));
}

/**
 * A function which expands valid range syntax, and wraps invalid in an array.
 * @private
 * @param {String} value - string to check and expand
 * @return {Array}
 */
function range (s) {
  const args = s.split(':').map(n => parseInt(n));
  if (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2])) return [s];
  const start = args[0];
  const end = args[~~type(args[1], 'n')];
  const step = args[2] || 1;
  const range = [];
  let next = start;
  while (start <= next && next <= end) {
    range.push(next);
    next += step;
  }
  return range;
}

exports.deepClone = deepClone;
exports.default = nanoCSS;
exports.expand = expand;
exports.generate = generate;
exports.inject = inject;
