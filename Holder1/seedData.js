const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./Holder1/Module/user.model');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create test user
        const testUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        testUser.password = hashedPassword;

        // Create user
        const user = await UserModel.create(testUser);
        console.log('Test user created:', user);

        // Close connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
