let NinjaStream = require('./ninja_stream');
let WalkStream = require('./walk_stream');
let createRegExpFilter = require('./create_regexp_filter');
let createWriteStream = require('fs').createWriteStream;

module.exports = function main(dir) {
  let reader = new WalkStream(dir);
  let writer = createWriteStream(`${dir}/build.ninja`);
  reader
    .pipe(createRegExpFilter(/.*\/config.js/))
    .pipe(new NinjaStream())
    .pipe(writer);
  return new Promise(resolve => writer.on('finish', resolve));
};
