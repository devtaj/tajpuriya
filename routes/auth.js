const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Validation middleware
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('profession').trim().isLength({ min: 2 }).withMessage('Profession is required')
];

// Routes
router.post('/register', upload.single('profileImage'), registerValidation, register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

module.exports = router;