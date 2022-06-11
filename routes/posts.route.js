const Router = require('express').Router;
const PostsController = require('../controllers/posts.controller');
const authorize = require('../middlewares/auth.middleware');

const router = module.exports = new Router();

/**
 * Get Posts
 */
router.get('', PostsController.getPosts);

/**
 * Get Post By Id
 */
router.get('/:id', PostsController.getPost);

/**
 * Add Post
 */
router.post(
  '',
  authorize,
  PostsController.createPost,
);

/**
 * Patch Post
 */
router.patch(
  '/:id',
  authorize,
  PostsController.updatePost,
);

/**
 * Delete Post
 */
router.delete('/:id', authorize, PostsController.deletePost);
