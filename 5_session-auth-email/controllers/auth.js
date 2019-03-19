const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeTab: 'login',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      if (!user) return res.redirect('/login')

      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              if (err) console.log(err)
              res.redirect('/')
            })
          } else {
            res.redirect('/login')
          }
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    activeTab: 'signup',
    isAuthenticated: false,
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email: email })
    .then(result => {
      if (result) {
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          })
          return user.save()
        })
        .then(() => res.redirect('/login'))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
