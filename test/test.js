require('colors');

const logResults = (name, [fails, total]) => {
  console.log(name.yellow.bold);
  if (fails) {
    console.log(`> Test failed (${total - fails}/${total}) passed. ${fails} fails.`.red.bold);
  } else {
    console.log(`> All tests passed (${total}/${total})`.white.bold);
  }
};

logResults('(sanity checks)', require('./sanity'));
logResults('deepClone()', require('./deepClone'));
logResults('flatten()', require('./flatten'));
logResults('inject()', require('./inject'));
logResults('generate()', require('./generate'));
logResults('nCSS()', require('./default'));
