const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkLogin() {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'shrey@gmail.com';
    const passwordsToTry = ['123456', '12345678', 'password', 'Shrey@123', 'shrey123'];
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found');
        return;
    }
    console.log(`User found: ${user.email}`);
    
    for (const pwd of passwordsToTry) {
        const isMatch = await user.comparePassword(pwd);
        console.log(`Password "${pwd}" match: ${isMatch}`);
    }
    
    // Check registration hook issue...
    // Did they register by sending JSON with trailing spaces or something?
    
    mongoose.connection.close();
}

checkLogin().catch(console.error);
