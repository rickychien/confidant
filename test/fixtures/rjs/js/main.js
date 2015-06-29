define(function(require, exports, module) {

let hello = require('./hello');

module.exports = function() {
  hello.sayHello();
};

});

require(['main'], main => main());
