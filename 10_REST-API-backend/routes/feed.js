const express = require('express')
const { body } = require('express-validator/check')

//* IMPORT CONTROLLERS
const { getPosts, createPost, getPost } = require('../controllers/feed')

//* INIT ROUTER
const router = express.Router()

//* ROUTES
//? ----- '/feed'
router.get('/posts', getPosts)

router.post(
  '/post',
  [
    body('title')
      .isString()
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .isString()
      .trim()
      .isLength({ min: 5 }),
  ],
  createPost
)

router.get('/post/:postId', getPost)

module.exports = router
