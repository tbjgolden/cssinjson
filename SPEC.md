# nanoCSS Language Specification

## (:root) block <Block>

`[(Rule|SuperRule|VarLoop|NestedLoop)*]`

```json
[
  [
    ".white-button",
    [
      ["background-color", "white"],
      ["color", "red"],
      ["border-radius", "4px"]
    ]
  ],
  {
    "$": [
      [".red", "red"],
      [".blue", "blue"]
    ],
    "_": [
      [
        "-text",
        ["color", "{1}"]
      ]
    ]
  }
]
```

## variable loop <VarLoop>

```
{
  [keyA]: Array|String|(Any),
  ...
  _: Block
}
```

```json
{
  "color": ["red", "blue"],
  "_": [
    [
      ".text-{color}",
      [
        ["color", "{color}"]
      ]
    ]
  ]
}
```

## nested loop <NestedLoop>

```
{
  $: [
    [String, ...String]
  ],
  _: Block
}
```

```json
{
  "$": [
    [".red", "red"],
    [".blue", "blue"]
  ],
  "_": [
    [
      "-text",
      ["color", "{1}"]
    ]
  ]
}
```

## rule <Rule>

`[String, [PropValPair*]]`

```json
[
  ".white-button",
  [
    ["background-color", "white"],
    ["color", "red"],
    ["border-radius", "4px"]
  ]
]
```

## super rule <SuperRule>

`[String, [(PropValPair|Rule)*]]`

```json
[
  "@media screen",
  [
    ".white-button",
    [
      ["background-color", "white"],
      ["color", "red"],
      ["border-radius", "4px"]
    ]
  ]
]
```

## property-value pair <PropValPair>

`[String, String]`

```json
["color", "red"]
```
