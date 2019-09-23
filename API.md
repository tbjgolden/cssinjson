# CSSinJSON Compiler API

All functions assume valid input. Behavior with invalid input is not defined -
errors are not guaranteed - this is done to reduce the footprint.

A development environment friendly solution is on the roadmap.

## Functions

<dl>
<dt><a href="#compile">compile(input, [vars])</a> ⇒ <code>String</code></dt>
<dd><p>Generates a CSS string from a CSSinJSON object</p>
</dd>
<dt><a href="#expand">expand(input)</a> ⇒ <code>Array</code></dt>
<dd><p>Expands a CSSinJSON object into a flattened set of rules</p>
</dd>
<dt><a href="#generate">generate(flatRules)</a> ⇒ <code>String</code></dt>
<dd><p>Generates a CSS string from a flattened set of rules</p>
</dd>
<dt><a href="#inject">inject(value, [vars])</a> ⇒ <code>Array</code> | <code>String</code></dt>
<dd><p>Replaces all instances of variable syntax in an object with their values</p>
</dd>
<dt><a href="#deepClone">deepClone(obj, [clone])</a> ⇒ <code>Object</code></dt>
<dd><p>A fast and small deep clone algorithm</p>
</dd>
</dl>

<a name="compile"></a>

## (default) compile(input, [vars]) ⇒ <code>String</code>
Generates a CSS string from a CSSinJSON object

**Kind**: global function  
**Returns**: <code>String</code> - CSS - the CSS generated from the CSSinJSON object, as a string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>Object</code> \| <code>Array</code> \| <code>String</code> |  | source CSSinJSON as JSON string or object |
| [vars] | <code>Object</code> | <code>{_:[]}</code> | extra variables that can be used in compilation |

<a name="expand"></a>

## expand(input) ⇒ <code>Array</code>
Expands a CSSinJSON object into a flattened set of rules

**Kind**: global function  
**Returns**: <code>Array</code> - the corresponding flattened set of rules  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Object</code> \| <code>Array</code> \| <code>String</code> | source CSSinJSON as JSON (string or object) |

<a name="generate"></a>

## generate(flatRules) ⇒ <code>String</code>
Generates a CSS string from a flattened set of rules

**Kind**: global function  
**Returns**: <code>String</code> - CSS - the CSS generated from the rules, as a string  

| Param | Type | Description |
| --- | --- | --- |
| flatRules | <code>Array</code> | the flattened representation of a stylesheet |

<a name="inject"></a>

## inject(value, [vars]) ⇒ <code>Array</code> \| <code>String</code>
Replaces all instances of variable syntax in an object with their values

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>String</code> - value with all variable syntax replaced by values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | value to check for variable syntax |
| [vars] | <code>Object</code> | <code>{_:[]}</code> | object to clone into (persists own keys) |

<a name="deepClone"></a>

## deepClone(obj, [clone]) ⇒ <code>Object</code>
A fast and small deep clone algorithm

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | object to deep clone |
| [clone] | <code>Object</code> | <code>{}</code> | object to clone into (persists own keys) |
