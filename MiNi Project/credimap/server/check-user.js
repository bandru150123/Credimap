const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find().limit(5);
    for (let u of users) {
        console.log(`Email: ${u.email}`);
        console.log(`Password is hashed? ${u.password.startsWith('$2')}`);
        console.log(`Password snippet: ${u.password.substring(0, 15)}...`);
    }
    mongoose.connection.close();
}

checkUser().catch(console.error);
