const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllerCustomer");

router.get("/products", Controller.viewAllProducts);
router.get("/product/:id", Controller.viewOneProduct);

module.exports = router;
