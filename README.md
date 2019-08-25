# nanoCSS

**CSS in JSON** - The optimal way to decrease your CSS bytes

---

**CSS is verbose**.

CSS preprocessor source files (.scss, .less) convey the same information in
a much smaller data footprint.

But it could be even smaller.

## `nanoCSS` is as small as it gets

It unpacks the CSS from a JSON source, with nesting and loop encoding,
like server-side-oriented preprocessors.

Kind of like a vector drawing but for CSS.

Unlike SVGs though, nanoCSS has no built in browser compiler, so the size of
the compiler must be extremely small, as it also must be sent to the client.

## How big is this compiler?

Very small.

The compiler relies on JSON.parse to reduce the size of the payload, and then
implements a tiny recursive LR(1) algorithm to turn it into a flattened
stylesheet array, or raw CSS.

## Usage

```sh
# Some usage instructions
```
