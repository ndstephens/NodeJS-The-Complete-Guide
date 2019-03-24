const express = require('express')
const { body } = require('express-validator/check')
const isAuth = require('../middleware/is-auth')

const User = require('../models/user')

//* IMPORT CONTROLLERS
const authControllers = require('../controllers/auth')

//* INIT ROUTER
const router = express.Router()

//* ROUTES  --------   '/auth'
//? CREATE OR UPDATE USER
router.put(
  '/signup',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) return Promise.reject('Email already exists')
        })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty(),
  ],
  authControllers.signup
)

//? LOGIN USER
router.post('/login', authControllers.login)

//? GET USER STATUS
router.get('/status', isAuth, authControllers.getUserStatus)

//? UPDATE USER STATUS
router.patch(
  '/status',
  isAuth,
  [
    body('status', 'Must include a status')
      .trim()
      .not()
      .isEmpty(),
  ],
  authControllers.updateUserStatus
)

//
//* EXPORT ROUTER
module.exports = router
