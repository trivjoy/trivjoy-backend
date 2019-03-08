const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  encryptPassword: async plainPassword => {
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(plainPassword, salt)

    return {
      salt,
      encryptedPassword
    }
  },

  comparePassword: async (password, encryptedPassword) => {
    const isAuthenticated = await bcrypt.compare(password, encryptedPassword)

    return isAuthenticated
  },

  createToken: async foundUser => {
    const payload = {
      sub: foundUser._id,
      name: foundUser.name,
      email: foundUser.email
    }

    const token = await jwt.sign(payload, process.env.SECRET)

    return token
  },

  verifyToken: async token => {
    try {
      const decodedToken = await jwt.verify(token, process.env.SECRET)

      return decodedToken
    } catch (error) {
      return error
    }
  }
}
