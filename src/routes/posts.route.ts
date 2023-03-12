import { PostsController } from '@tba/controllers';
import { authorize } from '@tba/middlewares';

import { Router } from 'express';

export const postsRoutes = Router();

/**
 * Get Posts
 */
postsRoutes.get('', PostsController.getPosts);

/**
 * Get Post By Id
 */
postsRoutes.get('/:id', PostsController.getPost);

/**
 * Add Post
 */
postsRoutes.post('', authorize, PostsController.createPost);

/**
 * Patch Post
 */
postsRoutes.patch('/:id', authorize, PostsController.updatePost);

/**
 * Delete Post
 */
postsRoutes.delete('/:id', authorize, PostsController.deletePost);
