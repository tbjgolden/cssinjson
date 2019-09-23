# Initial release objectives

- [x] nested css support
- [x] basic range support
- [x] change range syntax `{start}:{end(start)}:{step(1)}`
- [x] tests for sub functions
- [x] documentation
- [x] language spec

# Potential avenues

* development version with warnings and errors
  * errors with links to docs like ng
  * find duplicates
  * client-aware linting
  * more powerful linting
  * option to pass in custom middleware function for custom checks
  * check for invalid versions?
  * CSS output formatting options
  * documentation built into app (react implementation?)
    * triggered using console or button depending on option
    * check with a server that props and vals are valid?
* make a compressor css to nanoCSS?
* React component
* write tachyons-esque framework with it
* check for unused (or infrequently used) selectors?
  * perform a usage check in background with a web worker
  * allow a way for someone to check programmatically selector usage
