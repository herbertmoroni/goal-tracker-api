const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                process.exit(0);
            } catch (error) {
                throw new AppError('Error closing MongoDB connection', 500);
                process.exit(1);
            }
        });

    } catch (error) {
        throw new AppError('Error connecting to MongoDB', 500);
        process.exit(1);
    }
};

module.exports = connectDB;