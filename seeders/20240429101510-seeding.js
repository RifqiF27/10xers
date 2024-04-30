'use strict';

const { hasPass } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dataUser = [{
      username: "Admin",
      email: "admin@mail.com",
      password: "admin123",
      role: "Admin"
    }]
    const user = dataUser.map((el) => {
      el.password = hasPass(el.password)
      el.createdAt = el.updatedAt = new Date()
      return el
    })

    const products = require("../db/products.json").map((el) => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })

    await queryInterface.bulkInsert("Users", user)
    await queryInterface.bulkInsert("Products", products)
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    
  }
};
