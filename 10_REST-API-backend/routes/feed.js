const express = require('express')
const { body } = require('express-validator/check')
const isAuth = require('../middleware/is-auth')

//* IMPORT CONTROLLERS
const feedController = require('../controllers/feed')

//* INIT ROUTER
const router = express.Router()

//* ROUTES  --------   '/feed'
//? GET ALL POSTS
router.get('/posts', isAuth, feedController.getPosts)

//? GET A SINGLE POST
router.get('/post/:postId', feedController.getPost)

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
  feedController.createPost
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
  feedController.updatePost
)

//? DELETE A SINGLE POST
router.delete('/post/:postId', feedController.deletePost)

//
//* EXPORT ROUTER
module.exports = router
