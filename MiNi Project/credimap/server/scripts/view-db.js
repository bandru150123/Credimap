const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n--- Database Content ---');

        if (collections.length === 0) {
            console.log('No collections found in the database.');
        } else {
            console.log(`Found ${collections.length} collections:\n`);

            for (const collection of collections) {
                const count = await mongoose.connection.db.collection(collection.name).countDocuments();
                console.log(`- ${collection.name}: ${count} documents`);

                // Show first document preview
                if (count > 0) {
                    const firstDoc = await mongoose.connection.db.collection(collection.name).findOne({});
                    console.log(`  Preview: ${JSON.stringify(firstDoc).substring(0, 100)}...`);
                }
                console.log('');
            }
        }

        console.log('------------------------\n');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
