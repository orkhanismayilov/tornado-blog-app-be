const getFile = require('../middlewares/file.middleware')('image');
const Post = require('../models/post.model');

class PostsController {

  async getPosts(req, res) {
    const query = Post.find();
    const { limit, page } = req.query;

    if (limit && page) {
      query.skip(+limit * (+page - 1)).limit(+limit);
    }

    const fetchedPosts = await query.sort({ createdAt: 'desc' });
    const count = await Post.count();

    res.json({
      data: fetchedPosts,
      total: count,
    });
  };

  async getPost(req, res) {
    const post = await Post.findById(req.params.id);
    res.json(post);
  };

  async createPost(req, res) {
    getFile(req, res, async (err) => {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }

      const { title, content } = req.body;
      const file = req.file;
      const author = req.userData.userId;

      if (!(title && content && file)) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      const post = new Post({
        title,
        content,
        author,
        imagePath: `/images/${req.file.filename}`,
      });
      const createdPost = await post.save();
      res.status(201).json(createdPost);
    });
  };

  async updatePost(req, res) {
    getFile(req, res, async (err) => {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }

      const { title, content } = req.body;
      let { imagePath } = req.body;
      const file = req.file;

      if (!(title && content && (imagePath || file))) {
        return res.status(400).json({ message: 'Invalid post data' });
      }

      if (req.file) {
        imagePath = `/images/${req.file.filename}`;
      }

      const post = await Post.findById(req.params.id);
      if (post.author !== req.userData.userId) {
        return res.status(403).json({ message: 'You do not have permisson to edit this post' });
      }

      post.title = title;
      post.content = content;
      post.imagePath = imagePath;
      await post.save();

      res.json(null);
    });
  };

  async deletePost(req, res) {
    const post = await Post.findById(req.params.id);
    if (post.author !== req.userData.userId) {
      return req.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    res.status(200);
  };

}

module.exports = new PostsController();
