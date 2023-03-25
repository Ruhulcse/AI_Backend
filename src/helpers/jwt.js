const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret_key = process.env.SECRET_KEY;

module.exports.encode = function (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret_key, (err, token) => {
      if (err) {
        console.log(err.message || "JWT Encoding Error");
        return resolve(null);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports.decode = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret_key, (err, payload) => {
      if (err) {
        console.log(err.message || "JWT Decoding Error");
        return resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};
