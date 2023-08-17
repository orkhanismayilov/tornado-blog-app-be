import { MAX_FILE_SIZE } from '@tba/constants';
import { Post } from '@tba/interfaces';
import { getFile } from '@tba/middlewares';
import { PostModel } from '@tba/models';
import { deleteFile } from '@tba/utils';

import { RequestHandler } from 'express';
import { FilterQuery } from 'mongoose';
import { MulterError } from 'multer';
import slugify from 'slugify';
import { v1 as uuidv1, validate as validateUUID } from 'uuid';

export class PostsController {
  static getPosts: RequestHandler = async (req, res) => {
    const query = PostModel.find();
    const { limit, page } = req.query;

    if (limit && page) {
      query.skip(+limit * (+page - 1)).limit(+limit);
    }

    const fetchedPosts = await query.sort({ createdAt: 'desc' }).populate('author');
    const count = await PostModel.count();

    res.json({
      data: fetchedPosts,
      total: count,
    });
  };

  static getPost: RequestHandler = async (req, res) => {
    const isUUID = validateUUID(req.params.idOrSlug);

    let filterQuery: FilterQuery<Post> = { slug: req.params.idOrSlug };
    if (isUUID) {
      filterQuery = { _id: req.params.idOrSlug };
    }

    const post = await PostModel.findOne(filterQuery).populate('author');

    if (+req.query.getRelated > 0) {
      let relatedFilterQuery: FilterQuery<Post> = {
        slug: { $ne: req.params.idOrSlug },
      };
      if (isUUID) {
        relatedFilterQuery = {
          id: { $ne: req.params.idOrSlug },
        };
      }

      const relatedPosts = await PostModel.find({ slug: { $ne: req.params.slug } }, '_id title slug imagePath', {
        limit: +req.query.getRelated,
      });

      return res.json({
        ...post.toJSON(),
        relatedPosts,
      });
    }

    res.json(post);
  };

  static createPost: RequestHandler = async (req, res) => {
    getFile('image')(req, res, async err => {
      if (err instanceof Error) {
        let message = err.message;
        if ((err as MulterError).code === 'LIMIT_FILE_SIZE') {
          message = `Max allowed file size is ${MAX_FILE_SIZE}MB!`;
        }

        return res.status(400).json({ message });
      }

      const { title, content }: Partial<Post> = req.body;
      const slug = `${slugify(title, { lower: true })}-${uuidv1().split('-')[0]}`;
      const file = req.file;
      const author = req.userData.userId;

      if (!(title && content && file)) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      const post = new PostModel({
        title,
        content,
        slug,
        author,
        imagePath: `/images/${file.filename}`,
      });
      const createdPost = await post.save();
      res.status(201).json(createdPost);
    });
  };

  static updatePost: RequestHandler = async (req, res) => {
    getFile('image')(req, res, async err => {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }

      const { title, content }: Partial<Post> = req.body;
      let { imagePath }: Partial<Post> = req.body;
      const file = req.file;

      if (!(title && content && (imagePath || file))) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      const post = await PostModel.findById(req.params.id);
      if (post.author !== req.userData.userId) {
        return res.status(403).json({ message: 'You do not have permisson to edit this post' });
      }

      if (file) {
        imagePath = `/images/${file.filename}`;
        deleteFile(post.imagePath.replace('/images', ''));
      }

      post.title = title;
      post.content = content;
      post.imagePath = file ? imagePath : post.imagePath;
      await post.save();

      res.json(null);
    });
  };

  static deletePost: RequestHandler = async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (post.author !== req.userData.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    deleteFile(post.imagePath.replace('/images', ''));

    await post.deleteOne();
    res.status(200).json(null);
  };
}
