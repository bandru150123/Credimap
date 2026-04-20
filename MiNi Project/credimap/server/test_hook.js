const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testHook() {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'testuser123@gmail.com';
    const passwordsToTry = ['mysecretpassword'];
    
    let user = await User.findOne({ email });
    if (user) {
        console.log(`Original Hashed Pwd length: ${user.password.length}`);
        
        // Simulating an update (like updateTheme)
        user.selectedTheme = 'dark';
        await user.save();
        
        // Re-fetch
        let updatedUser = await User.findOne({ email });
        console.log(`Updated Hashed Pwd length: ${updatedUser.password.length}`);
        let isMatch = await updatedUser.comparePassword('mysecretpassword');
        console.log(`Still matches after non-password save? ${isMatch}`);
    }
    mongoose.connection.close();
}

testHook().catch(console.error);
