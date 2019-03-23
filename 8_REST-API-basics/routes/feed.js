const express = require('express')

//* IMPORT CONTROLLERS
const { getPosts } = require('../controllers/feed')

//* INIT ROUTER
const router = express.Router()

//* ROUTES
//? ----- '/feed'
router.get('/posts', getPosts)

module.exports = router
