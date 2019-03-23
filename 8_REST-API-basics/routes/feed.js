const express = require('express')

//* IMPORT CONTROLLERS
const { getPosts, createPost } = require('../controllers/feed')

//* INIT ROUTER
const router = express.Router()

//* ROUTES
//? ----- '/feed'
router.get('/posts', getPosts)

router.post('/post', createPost)

module.exports = router
