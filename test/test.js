require('colors');

const logResults = (name, [fails, total]) => {
  console.log(name.yellow.bold);
  if (fails) {
    console.log(`> Test failed (${total - fails}/${total}) passed. ${fails} fails.`.red.bold);
  } else {
    console.log(`> All tests passed (${total}/${total})`.white.bold);
  }
};

logResults('sourceToFlatRules()', require('./sourceToFlatRules'));
logResults('flatRulesToCSS()', require('./flatRulesToCSS'));
logResults('nCSS()', require('./default'));
