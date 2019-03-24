const express = require('express')
const { body } = require('express-validator/check')

//* IMPORT CONTROLLERS
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
} = require('../controllers/feed')

//* INIT ROUTER
const router = express.Router()

//* ROUTES  --------   '/feed'
//? GET ALL POSTS
router.get('/posts', getPosts)

//? GET A SINGLE POST
router.get('/post/:postId', getPost)

//? CREATE A SINGLE POST
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

//? UPDATE A SINGLE POST
router.put(
  '/post/:postId',
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
  updatePost
)

module.exports = router
