/**
 * @fileoverview Executes find and sends the results through a stream.
 */
let Readable = require('stream').Readable;
let exec = require('mz/child_process').exec;
let exists = require('fs').existsSync;
let inherits = require('util').inherits;
let path = require('path');

let defaultOptions = Object.freeze({ exclude: [] });

/**
 * Options:
 *
 *   (Array) exclude - directories to omit from fs scan.
 */
function FindStream(dir, options={}) {
  Readable.call(this, { objectMode: true });
  options = Object.assign({}, defaultOptions, options);
  this.buffer = null;
  this.dir = dir;
  if (!path.isAbsolute(this.dir)) {
    this.dir = path.resolve(process.cwd(), this.dir);
  }

  let cmd = 'find . -type d';
  let exclude = options.exclude;
  if (Array.isArray(exclude) && exclude.length) {
    cmd += formatFindPrune(exclude);
  }

  exec(cmd, {
    cwd: this.dir,
    maxBuffer: 8 * Math.pow(10, 6)  // 8M
  })
  .then(result => {
    let stdout = result[0];
    this.buffer = stdout.split(/(\n|\r)/)
      .filter(line => !/^\s*$/.test(line))
      .map(line => path.resolve(this.dir, line))
      .filter(dir => exists(`${dir}/configure.js`))
      .map(dir => `${dir}/configure.js`);
  });
}
inherits(FindStream, Readable);
module.exports = FindStream;

FindStream.prototype._read = function() {
  if (!this.buffer) {
    // We haven't read anything yet so we should poll... ew.
    return setTimeout(this._read.bind(this), 10);
  }

  if (this.buffer.length) {
    let next = path.normalize(path.resolve(this.dir, this.buffer.shift()));
    return this.push(next);
  }

  // All done.
  this.push(null);
};

function formatFindPrune(ignore) {
  return ' \\\( ' +
         ignore.map(dir => `-name ${dir}`).join(' -o ') +
         ' \\\) -prune -o -print';
}
