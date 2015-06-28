/**
 * @fileoverview Creates a stream that filters out all of the elements
 *     that don't pass a boolean test.
 */
let Transform = require('stream').Transform;
let inherits = require('util').inherits;

function Filter(test) {
  Transform.call(this, { objectMode: true });
  this.test = test;
}
inherits(Filter, Transform);
module.exports = Filter;

Filter.prototype._transform = function(chunk, encoding, done) {
  if (this.test(chunk)) {
    this.push(chunk);
  }

  done();
};
