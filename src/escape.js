exports.ninjaEscape = function(str) {
  return str
    .replace(new RegExp('\\$', 'g'), '$$$$')
    .replace(/"/g, '\\"');
}

exports.envToString = function(env) {
  let str = '';

  for (let key in env) {
    str += `${envEscape(key)}='${envEscape(env[key])}' `;
  }

  return str.trim();
}

function envEscape(str) {
  return exports.ninjaEscape(str)
    .replace(/'/g, '\\"')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}
