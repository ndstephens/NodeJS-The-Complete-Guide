const bcrypt = require('bcryptjs')
const validator = require('validator')

const User = require('../models/user')

module.exports = {
  async createUser(args, req) {
    const { name, email, password } = args.userInput
    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Email is invalid' })
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short' })
    }

    if (errors.length > 0) {
      throw new Error('Invalid input')
    }

    const isExistingUser = await User.findOne({ email })
    if (isExistingUser) {
      throw new Error('User already exists')
    }

    const hashedPw = await bcrypt.hash(password, 8)

    const user = new User({
      name,
      email,
      password: hashedPw,
    })

    const createdUser = await user.save()

    return { ...createdUser._doc, _id: createdUser._id.toString() }
  },
}
