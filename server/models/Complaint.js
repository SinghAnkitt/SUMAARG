const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    imageUrl: {
        type: String,
        required: [true, 'Please upload an image']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    address: {
        type: String
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Pothole', 'Streetlight', 'Signage', 'Drainage', 'Other']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Active', 'In Progress', 'Resolved'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
