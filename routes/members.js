const express = require('express');
const router = express.Router();
const { auth, adminAuth, approvedMember } = require('../middleware/auth');
const {
  getMembers,
  getMemberById,
  getPendingMembers,
  approveMember,
  rejectMember
} = require('../controllers/memberController');

// Public routes
router.get('/', getMembers);
router.get('/:id', getMemberById);

// Admin routes
router.get('/admin/pending', adminAuth, getPendingMembers);
router.put('/admin/approve/:id', adminAuth, approveMember);
router.delete('/admin/reject/:id', adminAuth, rejectMember);

module.exports = router;