const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = {
  async createUser(args, req) {
    const { name, email, password } = args.userInput

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
