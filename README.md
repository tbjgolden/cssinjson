# `nanoCSS`

**CSS in JSON** - The optimal way to decrease your CSS bytes

---

**CSS is verbose**.

CSS preprocessor source files (.scss, .less) generate the same output from much
less code, by including variables and loops.

This project takes that principle and extends it by reducing it to a
JSON-encoded language designed to be as small as possible<sup>[1][2]</sup>.

## `nanoCSS` is as small as it gets

It unpacks the CSS from a JSON source, with nesting and loop encoding,
like server-side-oriented preprocessors.

Kind of like a vector drawing but for CSS.

(<sup>[1]</sup>) Unlike SVGs though, nanoCSS has no built in browser compiler,
so the size of the compiler must be extremely small, as it also must be sent to
the client.

## How big is this compiler?

(<sup>[2]</sup>) nanoCSS's full compiler is <!--<ES6-->987<!--ES6>--> bytes compressed and gzipped.
That's smaller than every CSS framework (even mincss, which is 995).

The compiler relies on JSON.parse to reduce the size of the payload, and then
implements a tiny recursive algorithm to turn it into a flattened stylesheet
array, or raw CSS.

It comes in both ES6+ (<!--<ES6-->987<!--ES6>--> bytes) and ES5-compliant (<!--<ES5-->1206<!--ES5>--> bytes) variants.

## Usage

This library contains the specification of the language and a compiler that
turns it into a CSS string.

The compiler is designed to be used on the client-side, in the browser, but
can also be used interoperably with `import` or `require`.

Specific use case implementations (e.g. React) are not implemented in this
library.

* [nanoCSS Language Specification](SPEC.md)
* [Compiler API](API.md)

## JS <script> tag

```sh
# Some usage instructions
yarn add nanocss # or `npm i nanocss`
```

(for ES5+)

```html
<script src="./node_modules/nanocss/dist/es5/index.js"></script>
```

(for ES6+)

```html
<script src="./node_modules/nanocss/dist/index.js"></script>
```

> Alternatively, you could instead just copy/download the compiler from
> [here for ES5+](dist/es5/index.js) or [here for ES6+](dist/index.js).

Then, you can access the methods from the nanoCSS object:

```js
console.log(
  nanoCSS.compile([
    ['@media (max-width: 800px)', [[
      '.red',
      [['color', 'red']]
    ]]]
  ])
); // logs "@media (max-width: 800px) { .red { color: red } }"
```

## Webpack/Node (import/require)

```sh
# Some usage instructions
yarn add nanocss # or `npm i nanocss`
```

```js
// either this, for webpack
import { compile } from 'nanocss';
// or this, for node
const { compile } = require('nanocss');

console.log(
  nanoCSS.compile([[
    '.red',
    [['color', 'red']]
  ]])
); // logs ".red { color: red }"
```
