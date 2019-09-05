Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepClone = deepClone;
exports.inject = inject;
exports.flatRulesToCSS = flatRulesToCSS;
exports.sourceToFlatRules = sourceToFlatRules;
exports["default"] = nCSS;

/* eslint-disable valid-typeof */
var varRegex = /\{(\^*)([0-9a-z])\}/i;
var ampRegex = /&/g;

var type = function type(x, s) {
  s = s || 'string';
  return typeof x === s;
};

var isPropVal = function isPropVal(x) {
  return type(x[0]) && type(x[1]);
};

var isRule = function isRule(x) {
  return type(x[0]) && Array.isArray(x[1]) && x[1].every(isPropVal);
};

var flatten = function flatten(x) {
  return isRule(x) ? [x] : x.map(flatten).reduce(function (l, x) {
    return l.concat(x);
  }, []);
};

function deepClone(obj, clone) {
  clone = clone || {};

  for (var k in obj) {
    var o = obj[k];
    clone[k] = clone[k] || (o && type(o, 'object') ? deepClone(o.constructor(), o) : o);
  }

  return clone;
}

function inject(obj, vars) {
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (Array.isArray(obj)) return obj.map(function (x) {
    return inject(x, vars, false);
  });
  obj += '';
  var match = obj.match(varRegex);

  while (match) {
    var index = vars._.length - match[1].length - 1;
    var k = parseInt(match[2]) || match[2];
    obj = obj.replace(match[0], (type(k, 'number') ? vars._[index] : vars)[k]);
    match = obj.match(varRegex);
  }

  if (root && vars._) {
    var sel = vars._[vars._.length - 1][0];
    return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : "".concat(sel).concat(obj);
  }

  return obj;
}

function flatRulesToCSS(flatRules) {
  return flatRules.map(function (pair) {
    return "".concat(pair[0], " { ").concat(pair[1].map(function (pair) {
      return "".concat(pair[0], ": ").concat(pair[1]);
    }).join('; '), " }");
  }).join('\n');
}

function sourceToFlatRules(input) {
  var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (type(input)) input = JSON.parse(input);
  var stylesheet = [];

  if (Array.isArray(input)) {
    // string
    if (type(input[0])) return inject(input, vars); // basic loop

    for (var i = 0; i < input.length; i++) {
      stylesheet[i] = sourceToFlatRules(input[i], vars, false);
    }
  } else if (input.$) {
    // nested loop
    var indirect = [];
    var direct = {};

    for (var _i = 0; _i < input.$.length; _i++) {
      var sel = inject(input.$[_i][0], vars);
      var newVars = deepClone(vars, {
        _: (vars._ || []).concat([input.$[_i]])
      });
      var val = sourceToFlatRules(input._, newVars, false);
      var pair = val.reduce(function (pair, input) {
        pair[~~isPropVal(input)].push(input);
        return pair;
      }, [[], []]);
      indirect.push.apply(indirect, pair[0].reduce(function (arr, input) {
        return arr.concat(input);
      }, []));
      if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
    }

    stylesheet = Object.entries(direct).concat(indirect);
  } else {
    // variable loop
    var combos = [vars];
    Object.keys(input).forEach(function (k) {
      if (k === '_') return;
      input[k].forEach(function (v) {
        combos.map(function (c) {
          c = deepClone(c);
          c[k] = v;
          return c;
        });
      });
      combos = input[k].map(function (v) {
        return combos.map(function (c) {
          c = deepClone(c);
          c[k] = v;
          return c;
        });
      }).reduce(function (arr, input) {
        return arr.concat(input);
      }, []);
    });

    for (var _i2 = combos.length - 1; _i2 >= 0; _i2--) {
      stylesheet[_i2] = sourceToFlatRules(input._, combos[_i2], false);
    }
  }

  return root ? flatten(stylesheet) : stylesheet;
}

function nCSS(input) {
  var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return flatRulesToCSS(sourceToFlatRules(input, vars, root));
}
