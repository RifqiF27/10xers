const express = require("express")
const router = express.Router()
const admin = require("./admin")
const  customer = require("./customer")

router.use("/public", customer)
router.use(admin)

module.exports = router
