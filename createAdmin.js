// Run this script to create the first admin user
// node createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@tajpuriyasamaj.com'
    });
    
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
