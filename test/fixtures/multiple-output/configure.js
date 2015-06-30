var exec = require('mz/child_process').exec;

module.exports = [
  {
    inputs: ['build.sh'],
    outputs: ['a', 'b'],
    rule: function() {
      return exec('./build.sh');
    }
  }
];
