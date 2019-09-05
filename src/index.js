/* eslint-disable valid-typeof */

const varRegex = /\{(\^*)([0-9a-z])\}/i;
const ampRegex = /&/g;

const type = (x, s) => {
  s = s || 'string';
  return typeof x === s;
};
const isPropVal = x => type(x[0]) && type(x[1]);
const isRule = x => type(x[0]) && Array.isArray(x[1]) && x[1].every(isPropVal);
const flatten = x =>
  isRule(x)
    ? [x]
    : x.map(flatten).reduce((l, x) => l.concat(x), []);

export function deepClone (obj, clone) {
  clone = clone || {};
  for (let k in obj) {
    const o = obj[k];
    clone[k] = clone[k] || ((o && type(o, 'object')) ? deepClone(o.constructor(), o) : o);
  }
  return clone;
}

export function inject (obj, vars, root = true) {
  if (Array.isArray(obj)) return obj.map(x => inject(x, vars, false));

  obj += '';
  let match = obj.match(varRegex);
  while (match) {
    const index = vars._.length - match[1].length - 1;
    const k = parseInt(match[2]) || match[2];
    obj = obj.replace(match[0], (type(k, 'number') ? vars._[index] : vars)[k]);
    match = obj.match(varRegex);
  }

  if (root && vars._) {
    const sel = vars._[vars._.length - 1][0];
    return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : `${sel}${obj}`;
  }

  return obj;
}

export function flatRulesToCSS (flatRules) {
  return flatRules
    .map(pair => `${pair[0]} { ${
      pair[1]
        .map(pair => `${pair[0]}: ${pair[1]}`)
        .join('; ')
    } }`)
    .join('\n');
}

export function sourceToFlatRules (input, vars = {}, root = true) {
  if (type(input)) input = JSON.parse(input);

  let stylesheet = [];

  if (Array.isArray(input)) {
    // string
    if (type(input[0])) return inject(input, vars);
    // basic loop
    for (let i = 0; i < input.length; i++) {
      stylesheet[i] = sourceToFlatRules(input[i], vars, false);
    }
  } else if (input.$) { // nested loop
    const indirect = [];
    const direct = {};

    for (let i = 0; i < input.$.length; i++) {
      const sel = inject(input.$[i][0], vars);
      const newVars = deepClone(vars, {
        _: (vars._ || []).concat([input.$[i]])
      });
      const val = sourceToFlatRules(input._, newVars, false);
      const pair = val.reduce((pair, input) => {
        pair[~~isPropVal(input)].push(input);
        return pair;
      }, [[], []]);
      indirect.push.apply(
        indirect,
        pair[0].reduce((arr, input) => arr.concat(input), [])
      );
      if (pair[1].length) direct[sel] = (direct[sel] || []).concat(pair[1]);
    }

    stylesheet = Object.entries(direct).concat(indirect);
  } else { // variable loop
    let combos = [vars];

    Object.keys(input)
      .forEach(k => {
        if (k === '_') return;

        input[k].forEach(v => {
          combos.map(c => {
            c = deepClone(c);
            c[k] = v;
            return c;
          });
        });

        combos = input[k]
          .map(v => (
            combos.map(c => {
              c = deepClone(c);
              c[k] = v;
              return c;
            })
          ))
          .reduce((arr, input) => arr.concat(input), []);
      });
    for (let i = combos.length - 1; i >= 0; i--) {
      stylesheet[i] = sourceToFlatRules(input._, combos[i], false);
    }
  }

  return root ? flatten(stylesheet) : stylesheet;
}

export default function nCSS (input, vars = {}, root = true) {
  return flatRulesToCSS(sourceToFlatRules(input, vars, root));
}
