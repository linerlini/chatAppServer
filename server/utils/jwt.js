const jwt = require('jsonwebtoken');
const { SECRET, JWTTIMEOUT } = require('../../config');

const TOKEN_INVALID = 0;
const TOKEN_TIMEOU = 1;
const TOKEN_OK = 2;
function sign(payload) {
  const sign = jwt.sign(payload, SECRET, {
    expiresIn: JWTTIMEOUT,
  });
  return sign;
}

function verify(jwtToken) {
  if (!jwtToken) {
    return reject(TOKEN_INVALID);
  }
  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject(TOKEN_TIMEOU);
        } else {
          reject(TOKEN_INVALID);
        }
      } else {
        resolve(decoded);
      }
    })
  });
}

module.exports = {
  verify,
  sign,
  TOKEN_INVALID,
  TOKEN_OK,
  TOKEN_TIMEOU,
};
