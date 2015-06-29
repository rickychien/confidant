/**
 * @fileoverview A stream of all of the files in a given directory.
 */
let Readable = require('stream').Readable;
let inherits = require('util').inherits;
let walk = require('walk');

let defaultOptions = Object.freeze({
  exclude: []
});

/**
 * Options:
 *
 *   (Array) exclude - directories to omit from fs scan.
 */
function WalkStream(dir, options) {
  Readable.call(this, { objectMode: true });
  options = Object.assign({}, defaultOptions, options);
  this.buffer = [];
  this.finished = false;

  let walker = walk.walk(dir, { filters: options.exclude });
  let onfile, onerrors;

  walker.on('file', onfile = (root, stat, next) => {
    this.buffer.push(`${root}/${stat.name}`);
    next();
  });

  walker.on('errors', onerrors = () => {
    Array.from(arguments).map(arg => console.error(arg));
  });

  walker.once('end', () => {
    walker.removeListener('file', onfile);
    walker.removeListener('errors', onerrors);
    this.finished = true;
  });
}
inherits(WalkStream, Readable);
module.exports = WalkStream;

WalkStream.prototype._read = function() {
  if (this.buffer.length) {
    return this.push(this.buffer.shift());
  }

  if (this.finished && !this.buffer.length) {
    return this.push(null);
  }

  // If we're not finished but we don't have anything in the buffer
  // then we should poll the buffer... ew.
  setTimeout(this._read.bind(this), 10);
};
