const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', adminAuth, upload.single('image'), createEvent);
router.put('/:id', adminAuth, upload.single('image'), updateEvent);
router.delete('/:id', adminAuth, deleteEvent);

module.exports = router;