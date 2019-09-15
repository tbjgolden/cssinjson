const varRegex = /\{(\^*)([0-9a-z]+)\}/i;
const ampRegex = /&/g;

// Helpers
function type (x, s) { s = s || 's'; return (typeof x)[0] === s; }
function isPropVal (x) { return type(x[0]) && type(x[1]); }
function isRule (x) {
  if (!type(x[0]) || !Array.isArray(x[1])) return false;
  let c = 1;
  for (let i = 0; i < x[1].length; i++) {
    if (!isPropVal(x[1][i])) c = 2;
  }
  return c;
}
function concatAll (xs) { return xs.reduce((l, x) => l.concat(x), []); }
function array (o) { return Array.isArray(o) ? o : [o]; }
function flat (x) {
  const c = isRule(x);
  if (c === 2) x[1] = flat(x[1]);
  return c ? [x] : concatAll(x.map(y => flat(y)));
}
function range (s) {
  const args = s.split(':').map(n => parseInt(n)).slice(0, 3);
  const start = args.length > 1 ? args[0] : 0;
  const end = args[args.length - 1];
  const step = args.length > 2 ? args[1] : 1;
  const range = [];
  let next = start;
  while (start <= next && next < end) {
    range.push(next);
    next += step;
  }
  return range;
}

export function deepClone (obj, clone) {
  clone = clone || {};
  for (let k in obj) {
    const o = obj[k];
    clone[k] = clone[k] || ((o && type(o, 'o')) ? deepClone(o.constructor(), o) : o);
  }
  return clone;
}

export function inject (obj, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;

  if (Array.isArray(obj)) return obj.map(x => inject(x, vars, false));

  obj += '';
  let match = obj.match(varRegex);

  while (match) {
    const index = vars._.length - match[1].length - 1;
    const n = parseInt(match[2]);
    // checks if arg name is an integer and if it's for a valid ancestor index
    /* eslint-disable-next-line no-self-compare */
    const k = (n === n && index >= 0) ? n : match[2];
    obj = obj.replace(match[0], (type(k, 'n') ? vars._[index] : vars)[k]);
    match = obj.match(varRegex);
  }

  if (root && vars._.length) {
    const sel = vars._[vars._.length - 1][0];
    return ~obj.indexOf('&') ? obj.replace(ampRegex, sel) : `${sel}${obj}`;
  }

  return obj;
}

export function generate (flatRules) {
  return flatRules
    .map(pair => `${pair[0]} { ${
      pair[1]
        .map(pair => (
          Array.isArray(pair[1])
            ? generate([pair])
            : `${pair[0]}: ${pair[1]}`
        ))
        .join('; ')
    } }`)
    .join('\n');
}

export function flatten (input, vars, root) {
  vars = vars || {};
  vars._ = vars._ || [];
  root = type(root, 'b') ? root : true;

  if (type(input)) input = JSON.parse(input);

  let stylesheet = [];

  if (Array.isArray(input)) {
    if (type(input[0])) return inject(input, vars);
    // basic loop
    for (let i = 0; i < input.length; i++) {
      stylesheet[i] = flatten(input[i], vars, false);
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
      const val = flatten(array(input._), newVars, false);
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
      stylesheet[i] = flatten(array(input._), combos[i], false);
    }
  }

  return root ? flat(stylesheet) : stylesheet;
}

export default function nCSS (input, vars, root) {
  return generate(flatten(input, vars, root));
}
