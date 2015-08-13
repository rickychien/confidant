module.exports = async function(dir, fn) {
  let prev = process.cwd();
  process.chdir(dir);
  let result = fn();
  if (typeof result.then === 'function') {
    result = await result;
  }

  process.chdir(prev);
  return result;
};
