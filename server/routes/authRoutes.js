const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.get('/me', protect, getMe);

module.exports = router;
