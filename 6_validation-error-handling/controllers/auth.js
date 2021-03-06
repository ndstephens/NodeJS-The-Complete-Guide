const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

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
    oldInput: { email: '' },
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      activeTab: 'login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email },
    })
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          activeTab: 'login',
          errorMessage: 'Invalid email',
          oldInput: { email },
        })
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
            return res.status(422).render('auth/login', {
              pageTitle: 'Login',
              activeTab: 'login',
              errorMessage: 'Invalid password',
              oldInput: { email },
            })
          }
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.getSignup = (req, res, next) => {
  let msg = req.flash('error')
  msg = msg.length === 0 ? null : msg

  res.render('auth/signup', {
    pageTitle: 'Signup',
    activeTab: 'signup',
    errorMessage: msg,
    oldInput: { email: '' },
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      activeTab: 'signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email },
    })
  }

  bcrypt
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
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
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

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account found')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save().then(() => {
          res.redirect('/')
          return transporter.sendMail({
            to: req.body.email,
            from: 'cs@node-complete.com',
            subject: 'Password Reset',
            html: `
            <p>You requested a password reset</p>
            <p>Click <a href="http://localhost:3000/reset/${token}">here</a> to set a new password</p>
            `,
          })
        })
      })
      .catch(err => {
        err.statusCode = 500
        next(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      let msg = req.flash('error')
      msg = msg.length === 0 ? null : msg

      res.render('auth/new-password', {
        pageTitle: 'New Password',
        activeTab: 'new-password',
        errorMessage: msg,
        userId: user._id.toString(),
        passwordToken: token,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body
  let resetUser

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then(params => res.redirect('/login'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}
