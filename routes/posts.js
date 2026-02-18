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
  getContacts,
  submitArticle,
  getPendingPosts,
  approvePost,
  likePost,
  dislikePost
} = require('../controllers/postController');

// Public routes
router.get('/', getPosts);
router.post('/contact', submitContact);
router.post('/submit', auth, upload.single('image'), submitArticle);

// Admin routes (must come before /:id routes)
router.get('/admin/pending', getPendingPosts);
router.get('/admin/contacts', adminAuth, getContacts);
router.put('/admin/approve/:id', approvePost);
router.delete('/admin/reject/:id', deletePost);

// Dynamic routes (must come after specific routes)
router.get('/:id', getPostById);
router.put('/:id/like', auth, likePost);
router.put('/:id/dislike', auth, dislikePost);
router.post('/', adminAuth, upload.single('image'), createPost);
router.put('/:id', adminAuth, upload.single('image'), updatePost);
router.delete('/:id', adminAuth, deletePost);

module.exports = router;