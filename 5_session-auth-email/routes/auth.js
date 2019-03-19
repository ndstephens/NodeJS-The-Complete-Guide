const express = require('express')
const router = express.Router()

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
} = require('../controllers/auth')

//? ------ '/'

router.get('/login', getLogin)

router.post('/login', postLogin)

router.get('/signup', getSignup)

router.post('/signup', postSignup)

router.post('/logout', postLogout)

router.get('/reset', getReset)

module.exports = router
