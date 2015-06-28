/**
 * @fileoverview A stream of all of the files in a given directory.
 */
let Readable = require('stream').Readable;
let inherits = require('util').inherits;
let walk = require('walk');

function WalkStream(dir) {
  Readable.call(this, { objectMode: true });
  this.buffer = [];
  this.finished = false;

  let walker = walk.walk(dir);

  walker.on('file', (root, stat, next) => {
    this.buffer.push(`${root}/${stat.name}`);
    next();
  });

  walker.on('errors', () => {
    Array.from(arguments).map(arg => console.error(arg));
  });

  walker.on('end', () => this.finished = true);
}
inherits(WalkStream, Readable);
module.exports = WalkStream;

WalkStream.prototype._read = function() {
  if (this.buffer.length) {
    this.push(this.buffer.shift());
  }

  if (this.finished && !this.buffer.length) {
    this.push(null);
  }

  // If we're not finished but we don't have anything in the buffer
  // then we should poll the buffer... ew.
  setTimeout(this._read.bind(this), 10);
};
