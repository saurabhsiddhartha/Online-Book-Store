const mongoose = require('mongoose');

const Connection = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
 Connection()

