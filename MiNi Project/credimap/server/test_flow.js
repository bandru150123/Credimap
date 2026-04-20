const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testFlow() {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'testuser123@gmail.com';
    const password = 'mysecretpassword';
    
    // delete if exists
    await User.deleteOne({ email });
    
    // simulate register
    const user = new User({ name: 'Test', email, password });
    await user.save();
    console.log(`Saved user. Hashed password: ${user.password}`);
    
    // fetch from db
    const fetchedUser = await User.findOne({ email });
    console.log(`Fetched user. Hashed password: ${fetchedUser.password}`);
    
    // test compare
    const isMatch = await fetchedUser.comparePassword(password);
    console.log(`Compare Match: ${isMatch}`);
    
    // direct bcrypt compare
    const directMatch = await bcrypt.compare(password, fetchedUser.password);
    console.log(`Direct Compare Match: ${directMatch}`);
    
    mongoose.connection.close();
}

testFlow().catch(console.error);
