const bcrypt = require("bcryptjs");
const rounds = 10;

module.exports.new = async function (password) {
  try {
    let salt = bcrypt.genSaltSync(rounds);
    return bcrypt.hashSync(password, salt);
  } catch (e) {
    console.log(e.message || "Bcrypt Error!");
    return null;
  }
};

module.exports.verify = function (password, hash) {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (e) {
    console.log(e.message || "Bcrypt Error!");
    return null;
  }
};
