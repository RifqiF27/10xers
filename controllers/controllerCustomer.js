const { Op } = require("sequelize");
const { Product } = require("../models");

class Controller {
  static async viewAllProducts(req, res, next) {
    try {
      const page = req.query.page ? +req.query.page : 1;
      const itemsPage = req.query.itemsPage ? +req.query.itemsPage : 3;

      let option = {
        offset: (page - 1) * itemsPage,
        limit: itemsPage,
        where: {},
      };
      const { name } = req.query;
      if (name) option.where = { name: { [Op.iLike]: `%${name}%` } };
      const data = await Product.findAndCountAll(option);
      if (data.rows == 0) throw { name: "NotFound" };
      const totalPage = Math.ceil(data.count / itemsPage);
      res.status(200).json({ Products: data.rows, totalPage: totalPage });
    } catch (err) {
      next(err);
    }
  }
  static async viewOneProduct(req, res, next) {
    try {
      const data = await Product.findOne({ where: { id: req.params.id } });
      if (!data) throw { name: "NotFound" };
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
