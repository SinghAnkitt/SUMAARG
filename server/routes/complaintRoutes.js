const express = require('express');
const router = express.Router();
const { createComplaint, getUserComplaints, getAllComplaints, updateComplaintStatus, getComplaintById } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/user', protect, getUserComplaints);
router.get('/all', protect, admin, getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, admin, updateComplaintStatus);

module.exports = router;
