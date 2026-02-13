const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  submitContact,
  getContacts
} = require('../controllers/postController');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/contact', submitContact);

// Admin routes
router.post('/', adminAuth, upload.single('image'), createPost);
router.put('/:id', adminAuth, upload.single('image'), updatePost);
router.delete('/:id', adminAuth, deletePost);
router.get('/admin/contacts', adminAuth, getContacts);

module.exports = router;