const fs = require('fs');
const path = require('path');
const sizes = require('../.size-snapshot.json');

const replacers = {
  ES5: sizes['dist/es5/index.js'].gzipped,
  ES6: sizes['dist/index.js'].gzipped
};

let readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');

Object.entries(replacers)
  .forEach(([str, val]) => {
    const start = `<!--<${str}-->`;
    const end = `<!--${str}>-->`;
    const regex = new RegExp(`${start}[^<\\n]*${end}`, 'g');
    readme = readme.replace(regex, `${start}${val}${end}`);
  });

fs.writeFileSync(path.join(__dirname, '../README.md'), readme);
