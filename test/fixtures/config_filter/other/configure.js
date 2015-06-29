var exec = require('child_process').execSync;

module.exports = [
  {
    inputs: ['random'],
    rule: function() {
      exec('cp random random-copy');
    },
    output: 'random-copy'
  }
];
