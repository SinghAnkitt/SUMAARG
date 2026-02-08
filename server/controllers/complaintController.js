const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');


const createComplaint = asyncHandler(async (req, res) => {
    const { title, description, imageUrl, latitude, longitude, address, category, priority } = req.body;

    if (!title || !description || !imageUrl || !latitude || !longitude || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const complaint = await Complaint.create({
        user: req.user.id,
        title,
        description,
        imageUrl,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude] 
        },
        address,
        category,
        priority: priority || 'Medium'
    });


    try {
        const admins = await User.find({ role: { $regex: /^admin$/i } });

        if (admins.length > 0) {
            const notifications = admins.map(admin => ({
                recipient: admin._id,
                message: `New Complaint Submitted: ${title}`,
                type: 'info',
                relatedId: complaint._id
            }));
            await Notification.insertMany(notifications);
        }
    } catch (notifyError) {
        console.error("Failed to create notifications:", notifyError);
    }

    res.status(201).json(complaint);
});


const getUserComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
});


const getAllComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(complaints);
});


const getComplaintById = asyncHandler(async (req, res) => {

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(404);
        throw new Error('Complaint not found (Invalid ID)');
    }

    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    res.status(200).json(complaint);
});


const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(404);
        throw new Error('Complaint not found (Invalid ID)');
    }

    if (!['Active', 'In Progress', 'Resolved'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );


    if (updatedComplaint) {
        await Notification.create({
            recipient: updatedComplaint.user,
            message: `Complaint Status Updated: "${updatedComplaint.title}" is now ${status}`,
            type: status === 'Resolved' ? 'success' : 'info',
            relatedId: updatedComplaint._id
        });
    }

    res.status(200).json(updatedComplaint);
});

module.exports = {
    createComplaint,
    getUserComplaints,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus
};
