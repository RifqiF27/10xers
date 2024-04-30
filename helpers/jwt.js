const jwt = require("jsonwebtoken");

const JWT_SECRET = "10xers";

const signToken = (token) => {
  return jwt.sign(token, JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { signToken, verifyToken };
