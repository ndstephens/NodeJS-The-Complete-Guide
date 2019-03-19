const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
)

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
        .then(() => {
          res.redirect('/login')
          return transporter.sendMail({
            to: email,
            from: 'cs@node-complete.com',
            subject: 'Signup Successful',
            html: `<h1>You successfully signed up</h1>`,
          })
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

exports.getReset = (req, res, next) => {
  let msg = req.flash('error')
  msg = msg.length === 0 ? null : msg

  res.render('auth/reset', {
    pageTitle: 'Password Reset',
    activeTab: 'reset',
    errorMessage: msg,
  })
}
