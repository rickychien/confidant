let WalkStream = require('../src/walk_stream');
let createRegExpFilter = require('../src/create_regexp_filter');
let expect = require('chai').expect;

suite('createRegExpFilter', function() {
  let stream;

  setup(function() {
    stream = new WalkStream(`${__dirname}/fixtures/config_filter`)
      .pipe(createRegExpFilter(/.*\/config.js/));
  });

  test('data', function(done) {
    let read = [];
    stream.on('data', function(file) {
      expect(file.endsWith('config.js')).to.be.true;
      read.push(file);
    });

    stream.on('end', function() {
      expect(read).to.have.length(3);
      done();
    });
  });
});
