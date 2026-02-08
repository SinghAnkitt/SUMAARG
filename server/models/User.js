const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePhoto: {
        type: String,
        default: 'no-photo.jpg'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
