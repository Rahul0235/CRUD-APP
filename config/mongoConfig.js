const mongoose = require('mongoose');   

// Connect to MongoDB

const connectDB = async () => {
    console.log('MONGO_URL:', process.env.MONGO_URL); // Log the MongoDB connection string

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;
