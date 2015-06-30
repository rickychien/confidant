var exec = require('child_process').execSync;

module.exports = [
  {
    inputs: ['random'],
    rule: function() {
      exec('cp random random-copy');
    },
    outputs: 'random-copy'
  }
];
