let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let exec = require('mz/child_process').exec;
let fs = require('mz/fs');
let main = require('../src/main');

chai.use(chaiAsPromised);
let expect = chai.expect;

let testCases = [
  {
    name: 'basic',
    dir: `${__dirname}/fixtures/config_filter`,
    verify: function() {
      let dir = this.dir;
      return Promise.all(
        [
          `${dir}/build.ninja`,
          `${dir}/random-copy`,
          `${dir}/one/random-copy`,
          `${dir}/other/random-copy`
        ].map(checkExists)
      );
    },
  },
  {
    name: 'rjs',
    dir: `${__dirname}/fixtures/rjs`,
    verify: function() {
      let dir = this.dir;
      return Promise.all(
        [
          `${dir}/build.ninja`,
          `${dir}/app.js`,
          `${dir}/application.zip`
        ].map(checkExists)
      );
    }
  },
  {
    name: 'multiple outputs',
    dir: `${__dirname}/fixtures/multiple-output`,
    verify: function() {
      let dir = this.dir;
      return Promise.all([
        `${dir}/build.ninja`,
        `${dir}/a`,
        `${dir}/b`
      ].map(checkExists));
    }
  }
];

suite('main', function() {
  testCases.forEach(testCase => {
    test(testCase.name, function() {
      let dir = testCase.dir;
      let execOpts = { cwd: dir, env: process.env };
      return exec('npm install', execOpts)
      .then(() => exec('ninja -t clean', execOpts))
      .then(() => fs.unlink(`${dir}/build.ninja`))
      .catch(() => { /* will fail if state is already clean */ })
      .then(() => {
        return main({ dir: dir });
      })
      .then(() => exec('ninja', execOpts))
      .then(testCase.verify.bind(testCase));
    });
  });
});

function checkExists(path) {
  return expect(fs.exists(path)).to.eventually.equal(
    true,
    `${path} should exist`
  );
}
