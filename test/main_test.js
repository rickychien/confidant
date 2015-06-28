let exec = require('mz/child_process').exec;
let expect = require('chai').expect;
let fs = require('fs');
let main = require('../src/main');

let dir = `${__dirname}/fixtures/config_filter`;
let files = [
  `${dir}/build.ninja`,
  `${dir}/random-copy`,
  `${dir}/one/random-copy`,
  `${dir}/other/random-copy`
];

suite('main', function() {
  setup(function() {
    files.map(file => {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        // It's fine if it doesn't exist.
      }
    });

    return main(dir)
    .then(() => exec('ninja', { cwd: dir, env: process.env }));
  });

  test('should write build.ninja', function() {
    files.forEach(file => expect(fs.existsSync(file)).to.be.true);
  });
});
