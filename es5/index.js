"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatRulesToCSS = flatRulesToCSS;
exports.sourceToFlatRules = sourceToFlatRules;
exports["default"] = nCSS;
exports.inject = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable valid-typeof */
var varRegex = /\{(\^*)([0-9a-z])\}/i;
var ampRegex = /&/g;

var deepClone = function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

var is = function is(x, s) {
  return _typeof(x) === s;
};

var isPropVal = function isPropVal(x) {
  return is(x[0], 'string') && is(x[1], 'string');
};

var isRule = function isRule(x) {
  return is(x[0], 'string') && Array.isArray(x[1]) && x[1].every(isPropVal);
};

var flatten = function flatten(x) {
  return isRule(x) ? [x] : x.map(flatten).reduce(function (l, x) {
    return [].concat(_toConsumableArray(l), _toConsumableArray(x));
  }, []);
};

var inject = function inject(obj, vars) {
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (Array.isArray(obj)) return obj.map(function (x) {
    return inject(x, vars, false);
  });
  obj = "".concat(obj);
  var match = obj.match(varRegex);

  while (match) {
    var index = vars._.length - match[1].length - 1;
    var k = parseInt(match[2]) || match[2];
    obj = obj.replace(match[0], (is(k, 'number') ? vars._[index] : vars)[k]);
    match = obj.match(varRegex);
  }

  if (root && vars._) {
    var sel = vars._[vars._.length - 1][0];
    return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : "".concat(sel).concat(obj);
  }

  return obj;
};

exports.inject = inject;

function flatRulesToCSS(flatRules) {
  return flatRules.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        rule = _ref2[0],
        propVals = _ref2[1];

    return "".concat(rule, " { ").concat(propVals.map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          prop = _ref4[0],
          val = _ref4[1];

      return "".concat(prop, ": ").concat(val);
    }).join('; '), " }");
  }).join('\n');
}

function sourceToFlatRules(input) {
  var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (is(input, 'string')) input = JSON.parse(input);
  vars = deepClone(vars);
  var stylesheet = [];

  if (Array.isArray(input)) {
    // string
    if (is(input[0], 'string')) return inject(input, vars); // basic loop

    for (var i = 0; i < input.length; i++) {
      stylesheet[i] = sourceToFlatRules(input[i], vars, false);
    }
  } else if (input.$) {
    // nested loop
    var indirect = [];
    var direct = {};

    for (var _i2 = 0; _i2 < input.$.length; _i2++) {
      var sel = inject(input.$[_i2][0], vars);

      var newVars = _objectSpread({}, vars, {
        _: [].concat(_toConsumableArray(vars._ || []), [input.$[_i2]])
      });

      var val = sourceToFlatRules(input._, newVars, false);
      var pair = val.reduce(function (pair, input) {
        pair[~~isPropVal(input)].push(input);
        return pair;
      }, [[], []]);
      indirect.push.apply(indirect, _toConsumableArray(pair[0].reduce(function (arr, input) {
        return [].concat(_toConsumableArray(arr), _toConsumableArray(input));
      }, [])));
      if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
    }

    stylesheet = [].concat(_toConsumableArray(Object.entries(direct)), indirect);
  } else {
    // variable loop
    var combos = [vars];
    Object.keys(input).forEach(function (k) {
      var _ref5;

      if (k === '_') return;
      combos = (_ref5 = []).concat.apply(_ref5, _toConsumableArray(input[k].map(function (v) {
        return combos.map(function (c) {
          return _objectSpread({}, c, _defineProperty({}, k, v));
        });
      })));
    });

    for (var _i3 = combos.length - 1; _i3 >= 0; _i3--) {
      stylesheet[_i3] = sourceToFlatRules(input._, combos[_i3], false);
    }
  }

  return root ? flatten(stylesheet) : stylesheet;
}

function nCSS(input) {
  var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return flatRulesToCSS(sourceToFlatRules(input, vars, root));
}