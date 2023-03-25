module.exports.generateCode = (code = Date.now()) => {
  const num = Math.floor(Math.random() * 9999);
  const date = Date.now();
  return parseInt(date) + num;
};
