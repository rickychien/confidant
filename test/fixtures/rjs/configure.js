var denodeify = require('promise').denodeify;
var exec = require('mz/child_process').exec;
var fs = require('mz/fs');
var mkdirp = denodeify(require('mkdirp'));
var ncp = denodeify(require('ncp').ncp);
var rimraf = denodeify(require('rimraf'));
var rjs = require('requirejs');

module.exports = [
  {
    inputs: ['build.js', 'js/**/*.js'],
    outputs: 'app.js',
    rule: function() {
      return fs.readFile('./build.js', 'utf8').then(function(contents) {
        var config = JSON.parse(contents);
        return new Promise(function(resolve) {
          rjs.optimize(config, resolve);
        });
      });
    }
  },
  {
    inputs: ['index.html', 'app.js', 'style/**/*'],
    outputs: 'application.zip',
    rule: function() {
      return mkdirp('stage')
      .then(function() {
        return Promise.all([
          ncp('index.html', 'stage/index.html'),
          ncp('app.js', 'stage/app.js'),
          ncp('style', 'stage/style')
        ]);
      })
      .then(function() {
        return exec('zip application.zip index.html app.js style', {
          cwd: './stage'
        });
      })
      .then(function() {
        return fs.rename('./stage/application.zip', './application.zip');
      })
      .then(function() {
        return rimraf('./stage');
      });
    }
  }
];
