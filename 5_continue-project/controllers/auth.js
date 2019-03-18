exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    pageTitle: 'Login',
    activeTab: 'login',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  res.redirect('/login')
}
