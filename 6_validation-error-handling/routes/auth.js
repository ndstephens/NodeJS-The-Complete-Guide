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
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password', 'Password must be at least 5 alphanumeric characters')
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  postSignup
)

router.post('/logout', postLogout)

router.get('/reset', getReset)

router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)

router.post('/new-password', postNewPassword)

module.exports = router
