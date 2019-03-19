const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeTab: 'login',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  User.findById('5c8ecae38f375680784ae395')
    .then(user => {
      req.session.user = user
      req.session.isLoggedIn = true
      req.session.save(err => {
        if (err) console.log(err)
        res.redirect('/')
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
      const user = new User({
        email,
        password,
        cart: { items: [] },
      })
      return user.save()
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
