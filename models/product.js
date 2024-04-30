'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, {foreignKey: "UserId"})
    }
  }
  Product.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
          len: {
            args: 6,
            msg: "Name min 6 characters"
          }
        }
      },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "color is required",
          },
          notEmpty: {
            msg: "color is required",
          },
          len: {
            args: 3,
            msg: "color min 3 characters"
          }
        }
      },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Stock is required",
        },
        notEmpty: {
          msg: "Stock is required",
        },
        min: {
          args: 1,
          msg: "Stock min 1"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required",
        },
        notEmpty: {
          msg: "Description is required",
        },
        len: {
          args: 20,
          msg: "Description min 20 characters"
        }
      }
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "imgUrl is required",
          },
          notEmpty: {
            msg: "imgUrl is required",
          },
          len: {
            args: 6,
            msg: "imgUrl min 6 characters"
          }
        }
      },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price is required",
        },
        notEmpty: {
          msg: "Price is required",
        },
        min: {
          args: 6000000,
          msg: "Price min 6.000.000"
        },
        max: {
          args: 30000000,
          msg: "Price max 30.000.000"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};