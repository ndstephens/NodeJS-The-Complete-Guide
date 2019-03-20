const express = require('express')
const { check, body } = require('express-validator/check')
const router = express.Router()

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth')

//? ------ '/'

router.get('/login', getLogin)

router.post('/login', postLogin)

router.get('/signup', getSignup)

router.post(
  '/signup',
  [
    check('email') // 'check' will check body, params, headers, cookies, etc
      .isEmail()
      // 'withMessage' only relates to the 'isEmail' check
      .withMessage('Please enter a valid email'),
    body('password', 'Password must be at least 5 alphanumeric characters')
      // 'body' only checks the req.body
      // second argument is custom error message for any/all password errors
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match')
      }
      return true
    }),
  ],
  postSignup
)

router.post('/logout', postLogout)

router.get('/reset', getReset)

router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)

router.post('/new-password', postNewPassword)

module.exports = router
