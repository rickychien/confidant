module.exports = function(stream) {
  let result = [];
  return new Promise(resolve => {
    stream.on('data', e => result.push(e));
    stream.on('end', () => resolve(result));
  });
};
