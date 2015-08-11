let dirname = require('path').dirname;
let flatten = require('lodash/array/flatten');
let glob = require('glob').sync;
let ninjaEscape = require('./escape').ninjaEscape;

exports.getOutputs = function(file, task) {
  let dir = dirname(file);
  return (
    Array.isArray(task.outputs) ?
      task.outputs :
      [task.outputs]
  ).map(output => `${dir}/${ninjaEscape(output)}`);
};

exports.getInputs = function(file, task) {
  let dir = dirname(file);
  return flatten(
    task.inputs.map(input => isGlobExpression(input) ? glob(input, { cwd: dir }) : input),
    true
  )
  .filter(input => input.indexOf(' ') === -1)  // ninja can't handle ws
  .map(input => `${dir}/${ninjaEscape(input)}`);
};

function isGlobExpression(expression) {
  return expression.includes('*') ||
         expression.includes('?') ||
         expression.includes('[') ||
         expression.includes('!') ||
         expression.includes('+') ||
         expression.includes('@');
}
