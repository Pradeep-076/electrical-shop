const mongoose = require('mongoose');
require('dotenv').config();

const testAtlasConnection = async () => {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log('Successfully connected to MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        if (err.message.includes('IP') || err.message.includes('whitelist')) {
            console.error('ERROR: Your current IP is likely NOT whitelisted in MongoDB Atlas.');
        }
        process.exit(1);
    }
};

testAtlasConnection();
