const Post = require('../models/Post');
const Contact = require('../models/Contact');

const getPosts = async (req, res) => {
  try {
    const { category, published } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (published !== undefined) {
      query.isPublished = published === 'true';
    } else {
      query.isPublished = true; // Default to published posts
    }

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name');

    if (!post || (!post.isPublished && req.user?.role !== 'admin')) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category } = req.body;

    const post = new Post({
      title,
      content,
      excerpt,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      author: req.user.id
    });

    await post.save();
    await post.populate('author', 'name');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      type: type || 'contact'
    });

    await contact.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  submitContact,
  getContacts
};