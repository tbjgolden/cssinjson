(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.nCSS = {}));
}(this, function (exports) { 'use strict';

  /* eslint-disable valid-typeof */

  const varRegex = /\{(\^*)([0-9a-z])\}/i;
  const ampRegex = /&/g;

  const deepClone = obj => JSON.parse(JSON.stringify(obj));
  const is = (x, s) => typeof x === s;
  const isPropVal = x => is(x[0], 'string') && is(x[1], 'string');
  const isRule = x => is(x[0], 'string') && Array.isArray(x[1]) && x[1].every(isPropVal);
  const flatten = x =>
    isRule(x)
      ? [x]
      : x.map(flatten).reduce((l, x) => [...l, ...x], []);

  const inject = (obj, vars, root = true) => {
    if (Array.isArray(obj)) return obj.map(x => inject(x, vars, false));

    obj = `${obj}`;
    let match = obj.match(varRegex);
    while (match) {
      const index = vars._.length - match[1].length - 1;
      const k = parseInt(match[2]) || match[2];
      obj = obj.replace(match[0], (is(k, 'number') ? vars._[index] : vars)[k]);
      match = obj.match(varRegex);
    }

    if (root && vars._) {
      const sel = vars._[vars._.length - 1][0];
      return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : `${sel}${obj}`;
    }

    return obj;
  };

  function flatRulesToCSS (flatRules) {
    return flatRules
      .map(([rule, propVals]) => `${rule} { ${
      propVals
        .map(([prop, val]) => `${prop}: ${val}`)
        .join('; ')
    } }`)
      .join('\n');
  }

  function sourceToFlatRules (input, vars = {}, root = true) {
    if (is(input, 'string')) input = JSON.parse(input);

    vars = deepClone(vars);
    let stylesheet = [];

    if (Array.isArray(input)) {
      // string
      if (is(input[0], 'string')) return inject(input, vars);
      // basic loop
      for (let i = 0; i < input.length; i++) {
        stylesheet[i] = sourceToFlatRules(input[i], vars, false);
      }
    } else if (input.$) { // nested loop
      const indirect = [];
      const direct = {};

      for (let i = 0; i < input.$.length; i++) {
        const sel = inject(input.$[i][0], vars);
        const newVars = { ...vars, _: [...(vars._ || []), input.$[i]] };
        const val = sourceToFlatRules(input._, newVars, false);
        const pair = val.reduce((pair, input) => {
          pair[~~isPropVal(input)].push(input);
          return pair;
        }, [[], []]);
        indirect.push(
          ...pair[0].reduce((arr, input) => [...arr, ...input], [])
        );
        if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
      }

      stylesheet = [
        ...Object.entries(direct),
        ...indirect
      ];
    } else { // variable loop
      let combos = [vars];

      Object.keys(input)
        .forEach(k => {
          if (k === '_') return;
          combos = [].concat(
            ...input[k].map(v => combos.map(c => ({ ...c, [k]: v })))
          );
        });
      for (let i = combos.length - 1; i >= 0; i--) {
        stylesheet[i] = sourceToFlatRules(input._, combos[i], false);
      }
    }

    return root ? flatten(stylesheet) : stylesheet;
  }

  function nCSS (input, vars = {}, root = true) {
    return flatRulesToCSS(sourceToFlatRules(input, vars, root));
  }

  exports.default = nCSS;
  exports.flatRulesToCSS = flatRulesToCSS;
  exports.inject = inject;
  exports.sourceToFlatRules = sourceToFlatRules;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
