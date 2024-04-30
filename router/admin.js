const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const authentication = require("../middlewares/authentication");

router.get("/", (req, res) => {
  res.send("Hello world");
});

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.use(authentication);
router.post("/add-product", Controller.addProduct);
router.get("/view-products", Controller.viewAllProducts);
router.put("/edit-product/:id", Controller.editProduct);
router.delete("/delete-product/:id", Controller.deleteProduct);

module.exports = router;
