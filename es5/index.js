"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepClone = deepClone;
exports.inject = inject;
exports.generate = generate;
exports.flatten = flatten;
exports["default"] = nCSS;
var varRegex = /\{(\^*)([0-9a-z]+)\}/i;
var ampRegex = /&/g; // Helpers

function type(x, s) {
  s = s || 's';
  return (typeof x)[0] === s;
}

function isPropVal(x) {
  return type(x[0]) && type(x[1]);
}

function isRule(x) {
  return type(x[0]) && Array.isArray(x[1]) && x[1].every(isPropVal);
}

function concatAll(xs) {
  return xs.reduce(function (l, x) {
    return l.concat(x);
  }, []);
}

function array(o) {
  return Array.isArray(o) ? o : [o];
}

function flat(x, notRoot) {
  return isRule(x) ? [x] : concatAll(x.map(function (y) {
    return flat(y, true);
  }));
}

function deepClone(obj, clone) {
  clone = clone || {};

  for (var k in obj) {
    var o = obj[k];
    clone[k] = clone[k] || (o && type(o, 'o') ? deepClone(o.constructor(), o) : o);
  }

  return clone;
}

function inject(obj, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;
  if (Array.isArray(obj)) return obj.map(function (x) {
    return inject(x, vars, false);
  });
  obj += '';
  var match = obj.match(varRegex);

  while (match) {
    var index = vars._.length - match[1].length - 1;
    var n = parseInt(match[2]); // checks if arg name is an integer and if it's for a valid ancestor index

    /* eslint-disable-next-line no-self-compare */

    var k = n === n && index >= 0 ? n : match[2];
    obj = obj.replace(match[0], (type(k, 'n') ? vars._[index] : vars)[k]);
    match = obj.match(varRegex);
  }

  if (root && vars._.length) {
    var sel = vars._[vars._.length - 1][0];
    return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : "".concat(sel).concat(obj);
  }

  return obj;
}

function generate(flatRules) {
  return flatRules.map(function (pair) {
    return "".concat(pair[0], " { ").concat(pair[1].map(function (pair) {
      return "".concat(pair[0], ": ").concat(pair[1]);
    }).join('; '), " }");
  }).join('\n');
}

function flatten(input, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;
  if (type(input)) input = JSON.parse(input);
  var stylesheet = [];

  if (Array.isArray(input)) {
    if (type(input[0])) return inject(input, vars); // basic loop

    for (var i = 0; i < input.length; i++) {
      stylesheet[i] = flatten(input[i], vars, false);
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
      var val = flatten(array(input._), newVars, false);
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
      combos = concatAll(input[k].map(function (v) {
        return combos.map(function (c) {
          c = deepClone(c);
          c[k] = v;
          return c;
        });
      }));
    });

    for (var _i2 = 0; _i2 < combos.length; _i2++) {
      stylesheet[_i2] = flatten(array(input._), combos[_i2], false);
    }
  }

  return root ? flat(stylesheet) : stylesheet;
}

function nCSS(input, vars, root) {
  return generate(flatten(input, vars, root));
}