// Run this script to hash plain text passwords in admins collection
// node hashAdminPasswords.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hashPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Admin = mongoose.model('Admin', new mongoose.Schema({
      username: String,
      password: String
    }));
    
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin(s)`);
    
    for (const admin of admins) {
      // Check if password is already hashed (bcrypt hashes start with $2)
      if (!admin.password.startsWith('$2')) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        admin.password = hashedPassword;
        await admin.save();
        console.log(`✓ Hashed password for: ${admin.username}`);
      } else {
        console.log(`- Password already hashed for: ${admin.username}`);
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

hashPasswords();
