const bcrypt = require("bcryptjs")

const hasPass = (password) => {
    return bcrypt.hashSync(password)
}

const verified = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {hasPass, verified}