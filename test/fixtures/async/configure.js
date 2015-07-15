var Readable = require('stream').Readable;
var execSync = require('child_process').execSync;
var inherits = require('util').inherits;

function RuleStream() {
  Readable.call(this, { objectMode: true });
  this.buffer = [];
  this.finished = false;
  var i = 0;

  setTimeout(function() {
    this.buffer.push({
      inputs: ['a', 'b'],
      outputs: ['c'],
      rule: function() {
        execSync('cat a b > c');
      }
    });

    this.finished = ++i === 2;
  }.bind(this), 10);

  setTimeout(function() {
    this.buffer.push({
      inputs: ['c'],
      outputs: ['d'],
      rule: function() {
        execSync('cp c d');
      }
    });

    this.finished = ++i === 2;
  }.bind(this), 10);
}
inherits(RuleStream, Readable);
module.exports = RuleStream;

RuleStream.prototype._read = function() {
  if (this.buffer.length) {
    return this.push(this.buffer.shift());
  }

  if (this.finished && !this.buffer.length) {
    return this.push(null);
  }

  return setTimeout(this._read.bind(this), 10);
};
