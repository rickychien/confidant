let NinjaStream = require('./ninja_stream');
let WalkStream = require('./walk_stream');
let createRegExpFilter = require('./create_regexp_filter');
let createWriteStream = require('fs').createWriteStream;

module.exports = function main(dir) {
  let stream = new WalkStream(dir)
    .pipe(createRegExpFilter(/.*\/config.js/))
    .pipe(new NinjaStream())
    .pipe(createWriteStream(`${dir}/build.ninja`));
  return new Promise(resolve => stream.on('finish', resolve));
};
