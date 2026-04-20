const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const testEmail = 'shrey@gmail.com';
        const testPasswords = ['password', '123456', 'shrey', 'admin', 'test', 'shrey123'];
        
        console.log(`Testing login for: ${testEmail}\n`);
        
        const user = await User.findOne({ email: testEmail });
        if (!user) {
            console.log('User not found!');
            return;
        }
        
        console.log('User found. Testing passwords...\n');
        
        for (const password of testPasswords) {
            const isMatch = await user.comparePassword(password);
            console.log(`Password: "${password}" - Match: ${isMatch}`);
        }
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        mongoose.connection.close();
    }
}

testLogin();
