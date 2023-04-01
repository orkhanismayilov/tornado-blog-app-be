import { maxFileSize } from '@tba/constants';
import { getFile } from '@tba/middlewares';
import { PostModel } from '@tba/models';

import chalk from 'chalk';
import { RequestHandler } from 'express';
import fs from 'fs';
import { MulterError } from 'multer';
import path, { resolve } from 'path';

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
    const post = await PostModel.findById(req.params.id).populate('author');
    if (+req.query.getRelated > 0) {
      const relatedPosts = await PostModel.find({ _id: { $ne: req.params.id } }, '_id title imagePath', {
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
          message = `Max allowed file size is ${maxFileSize}MB!`;
        }

        return res.status(400).json({ message });
      }

      const { title, content }: { title: string; content: string } = req.body;
      const file = req.file;
      const author = req.userData.userId;

      if (!(title && content && file)) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      const post = new PostModel({
        title,
        content,
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

      const { title, content }: { title: string; content: string } = req.body;
      let { imagePath }: { imagePath: string } = req.body;
      const file = req.file;

      if (!(title && content && (imagePath || file))) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      if (file) {
        imagePath = `/images/${file.filename}`;
      }

      const post = await PostModel.findById(req.params.id);
      if (post.author !== req.userData.userId) {
        return res.status(403).json({ message: 'You do not have permisson to edit this post' });
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

    fs.rm(path.join(__dirname, '../../../public/images', post.imagePath.replace('/images', '')), err => {
      if (err) console.warn(chalk.redBright(`Cannot delete file: ${post.imagePath}\n${err.message}`));
    });

    await post.delete();
    res.status(200).json(null);
  };
}
