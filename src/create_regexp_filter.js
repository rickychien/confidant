/**
 * @fileoverview Creates a stream that filters out all of the elements
 *     that don't match a regular expression.
 */
let Filter = require('./filter');

module.exports = function createRegExpFilter(regexp) {
  return new Filter(chunk => regexp.test(chunk));
};
