const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserNotifications,
    markNotificationRead,
    markAllRead
} = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markNotificationRead);
router.put('/read-all', protect, markAllRead);

module.exports = router;
