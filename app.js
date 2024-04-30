const express = require("express")
const cors = require("cors")
const errHandler = require("./middlewares/errHandler")
const router = require("./router")
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(router)
app.use(errHandler)

// app.listen(port, () => {
//     console.log(`app listen on port ${port}`)
// })

module.exports = app