let WalkStream = require('../src/walk_stream');
let expect = require('chai').expect;

suite('WalkStream', function() {
  let stream;

  setup(function() {
    stream = new WalkStream(`${__dirname}/fixtures/walk_stream`, {
      exclude: ['tmp']
    });
  });

  test('should write all of the files', function(done) {
    let buffer = [];
    stream.on('data', buffer.push.bind(buffer));
    stream.on('end', () => {
      expect(buffer).to.deep.equal([
        `${__dirname}/fixtures/walk_stream/c`,
        `${__dirname}/fixtures/walk_stream/b/e`,
        `${__dirname}/fixtures/walk_stream/a/d/f`
      ]);

      done();
    });
  });
});
