const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@sumaarg.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create Admin
        await User.create({
            name: 'Authority Admin',
            email: 'admin@sumaarg.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin account created: admin@sumaarg.com / admin123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
