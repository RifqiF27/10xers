const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: "InvalidToken" };

    const decodeToken = verifyToken(access_token);
    const user = await User.findByPk(decodeToken.id);
    if (!user) throw { name: "InvalidToken" };

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication