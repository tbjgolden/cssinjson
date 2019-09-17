'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = nanoCSS;
exports.expand = expand;
exports.generate = generate;
exports.inject = inject;
exports.deepClone = deepClone;

/* eslint-disable no-self-compare */
var varRegex = /\{(\^*)([0-9a-z]+)\}/i;
var ampRegex = /&/g; // Helpers

var isArray = Array.isArray;

function isNaN(n) {
  return n !== n;
}

function type(x, s) {
  s = s || 's';
  return (typeof x)[0] === s;
}

function array(o) {
  return isArray(o) ? o : [o];
}

function concatAll(xs) {
  return xs.reduce(function (l, x) {
    return l.concat(x);
  }, []);
}
/**
 * Generates a CSS string from a nanoCSS object
 * @param {Object|Array|String} input - source nanoCSS as JSON string or object
 * @param {Object} [vars={_:[]}] - extra variables that can be used in compilation
 * @return {String} CSS - the CSS generated from the nanoCSS object, as a string
 */


function nanoCSS(input, vars, root) {
  return generate(expand(input, vars, root));
}
/**
 * Expands a nanoCSS object into a flattened set of rules
 * @param {Object|Array|String} input - source nanoCSS as JSON (string or object)
 * @return {Array} the corresponding flattened set of rules
 */


function expand(input, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;
  if (type(input)) input = JSON.parse(input);
  var stylesheet = [];

  if (isArray(input)) {
    if (type(input[0])) return inject(input, vars); // basic loop

    for (var i = 0; i < input.length; i++) {
      stylesheet[i] = expand(input[i], vars, false);
    }
  } else if (input.$) {
    // nested loop
    var indirect = [];
    var direct = {};

    for (var _i = 0; _i < input.$.length; _i++) {
      var sel = inject(input.$[_i][0], vars);
      var newVars = deepClone(vars, {
        _: vars._.concat([input.$[_i]])
      });
      var val = expand(array(input._), newVars, false);
      var pair = val.reduce(function (pair, input) {
        pair[~~isPropVal(input)].push(input);
        return pair;
      }, [[], []]);
      indirect.push.apply(indirect, concatAll(pair[0]));
      if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
    }

    stylesheet = Object.entries(direct).concat(indirect);
  } else {
    // variable loop
    var combos = [vars];
    Object.keys(input).forEach(function (k) {
      if (k === '_') return;
      if (type(input[k])) input[k] = range(input[k]);
      combos = concatAll(input[k].map(function (v) {
        return combos.map(function (c) {
          c = deepClone(c);
          c[k] = v;
          return c;
        });
      }));
    });

    for (var _i2 = 0; _i2 < combos.length; _i2++) {
      stylesheet[_i2] = expand(array(input._), combos[_i2], false);
    }
  }

  return root ? flat(stylesheet) : stylesheet;
}
/**
 * Generates a CSS string from a flattened set of rules
 * @param {Array} flatRules - the flattened representation of a stylesheet
 * @return {String} CSS - the CSS generated from the rules, as a string
 */


function generate(flatRules) {
  return flatRules.map(function (pair) {
    return "".concat(pair[0], " { ").concat(pair[1].map(function (pair) {
      return isArray(pair[1]) ? generate([pair]) : "".concat(pair[0], ": ").concat(pair[1]);
    }).join('; '), " }");
  }).join('\n');
}
/**
 * Replaces all instances of variable syntax in an object with their values
 * @param {*} value - value to check for variable syntax
 * @param {Object} [vars={_:[]}] - object to clone into (persists own keys)
 * @return {Array|String} value with all variable syntax replaced by values
 */


function inject(value, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;
  if (isArray(value)) return value.map(function (x) {
    return inject(x, vars, false);
  });
  value += '';
  var match = value.match(varRegex);

  while (match) {
    var index = vars._.length - match[1].length - 1;
    var n = parseInt(match[2]); // checks if arg name is an integer and if it's for a valid ancestor index

    /* eslint-disable-next-line no-self-compare */

    var k = n === n && index >= 0 ? n : match[2];
    value = value.replace(match[0], (type(k, 'n') ? vars._[index] : vars)[k]);
    match = value.match(varRegex);
  }

  if (root && vars._.length) {
    var sel = vars._[vars._.length - 1][0];
    return ~value.indexOf('&') ? value.replace(ampRegex, sel) : "".concat(sel).concat(value);
  }

  return value;
}
/**
 * A fast and small deep clone algorithm
 * @param {Object} obj - object to deep clone
 * @param {Object} [clone={}] - object to clone into (persists own keys)
 * @return {Object}
 */


function deepClone(obj, clone) {
  clone = clone || {};

  for (var k in obj) {
    var o = obj[k];
    clone[k] = clone[k] || (o && type(o, 'o') ? deepClone(o.constructor(), o) : o);
  }

  return clone;
}
/**
 * Determines if an array is a valid property value pair.
 * @private
 * @param  {Array} arr - array to check.
 * @return {Boolean}
 */


function isPropVal(x) {
  return type(x[0]) && type(x[1]);
}
/**
 * Determines if an array is a valid simple rule, a valid nested rule, or neither.
 * @private
 * @param {Array} arr - array to check.
 * @return {Boolean|Number} 1 if a leaf rule, 2 if it contains rules, false otherwise
 **/


function isRule(arr) {
  if (!type(arr[0]) || !isArray(arr[1])) return false;
  var c = 1;

  for (var i = 0; i < arr[1].length; i++) {
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


function flat(arr) {
  var c = isRule(arr);
  if (c === 2) arr[1] = flat(arr[1]);
  return c ? [arr] : concatAll(arr.map(function (child) {
    return flat(child);
  }));
}
/**
 * A function which expands valid range syntax, and wraps invalid in an array.
 * @private
 * @param {String} value - string to check and expand
 * @return {Array}
 */


function range(s) {
  var args = s.split(':').map(function (n) {
    return parseInt(n);
  });
  if (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2])) return [s];
  var start = args[0];
  var end = args[~~type(args[1], 'n')];
  var step = args[2] || 1;
  var range = [];
  var next = start;

  while (start <= next && next <= end) {
    range.push(next);
    next += step;
  }

  return range;
}
