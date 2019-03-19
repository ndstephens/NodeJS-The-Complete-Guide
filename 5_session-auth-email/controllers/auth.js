const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // Must first retrieve req.flash() b/c upon doing so it is erased.  Then check its value
  let msg = req.flash('error')
  msg = msg.length === 0 ? null : msg

  res.render('auth/login', {
    pageTitle: 'Login',
    activeTab: 'login',
    errorMessage: msg,
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }

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
            req.flash('error', 'Invalid email or password')
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
  let msg = req.flash('error')
  msg = msg.length === 0 ? null : msg

  res.render('auth/signup', {
    pageTitle: 'Signup',
    activeTab: 'signup',
    errorMessage: msg,
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email: email })
    .then(result => {
      if (result) {
        req.flash('error', 'Email already exists')
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
