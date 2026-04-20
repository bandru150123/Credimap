const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testSignup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const testEmail = 'testuser987@gmail.com';
        const testPassword = 'testpass123';
        const testName = 'Test User';
        
        console.log(`Testing signup for: ${testEmail}`);
        
        // Check if user exists
        let user = await User.findOne({ email: testEmail });
        if (user) {
            console.log('User already exists, deleting...');
            await User.deleteOne({ email: testEmail });
        }
        
        // Create new user
        user = new User({ name: testName, email: testEmail, password: testPassword });
        await user.save();
        
        console.log('User created successfully!');
        console.log('User ID:', user._id);
        console.log('Password is hashed:', user.password.startsWith('$2'));
        
        // Verify password works
        const isMatch = await user.comparePassword(testPassword);
        console.log('Password verification:', isMatch ? 'SUCCESS' : 'FAILED');
        
        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log('Test user cleaned up');
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        mongoose.connection.close();
    }
}

testSignup();
