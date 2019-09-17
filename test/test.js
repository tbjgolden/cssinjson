require('colors');

const totals = [0, 0];

const logResults = (name, [fails, total]) => {
  totals[0] += fails;
  totals[1] += total;
  console.log(name.yellow.bold);
  if (fails) {
    console.log(`> Test failed (${total - fails}/${total}) passed. ${fails} fails.`.red.bold);
  } else {
    console.log(`> All tests passed (${total}/${total})`.white.bold);
  }
};

logResults('(sanity checks)', require('./sanity'));
logResults('deepClone()', require('./deepClone'));
logResults('expand()', require('./expand'));
logResults('inject()', require('./inject'));
logResults('generate()', require('./generate'));
logResults('nCSS()', require('./default'));

const total = `${totals[1] - totals[0]} of ${totals[1]} tests passed`;

console.log(
`+${new Array(total.length + 2).fill('=').join('')}+
| ${total} |
+${new Array(total.length + 2).fill('=').join('')}+`.blue.bold
);
