const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const email = 'shrey@gmail.com';
        const newPassword = 'shrey123';
        
        console.log(`Resetting password for: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
            return;
        }
        
        user.password = newPassword;
        await user.save();
        
        console.log(`Password reset successfully! New password: "${newPassword}"`);
        
        // Test the new password
        const isMatch = await user.comparePassword(newPassword);
        console.log(`Password verification: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        mongoose.connection.close();
    }
}

resetPassword();
