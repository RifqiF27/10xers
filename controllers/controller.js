const { Op } = require("sequelize");
const { verified } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Product } = require("../models");

class Controller {
  static async register(req, res, next) {
    try {
      const data = await User.create(req.body);
      const access_token = signToken({ id: data.id });
      res.status(201).json({
        access_token,
        message: `User with id ${data.id} has been created`,
      });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { name: "InvalidInput" };

      const data = await User.findOne({ where: { email } });
      if (!data) throw { name: "InvalidEmail" };

      const isPassValid = verified(password, data.password);
      if (!isPassValid) throw { name: "InvalidEmail/Password" };

      const access_token = signToken({ id: data.id });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }
  static async addProduct(req, res, next) {
    try {
      const data = await Product.create({
        ...req.body,
        UserId: req.user.id,
      });
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async viewAllProducts(req, res, next) {
    try {
      const { name } = req.query;
      let option = {};
      if (name) option = { name: { [Op.iLike]: `%${name}%` } };
      const data = await Product.findAll({ where: option });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async editProduct(req, res, next) {
    try {
      const data = await Product.update(
        {
          ...req.body,
          UserId: req.user.id,
        },
        { where: { id: req.params.id } }
      );

      if (data == 0) throw { name: "NotFound" };
      res.status(200).json({ message: "Product has been updated" });
    } catch (err) {
      next(err);
    }
  }
  static async deleteProduct(req, res, next) {
    try {
      const data = await Product.findOne({ where: { id: req.params.id } });
      if (!data) throw { name: "NotFound" };
      await Product.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: "Delete success" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
