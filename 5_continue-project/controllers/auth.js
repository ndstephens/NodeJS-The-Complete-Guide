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

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
