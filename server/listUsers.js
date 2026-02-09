require('dotenv').config();
const { User } = require("./model");
const { connectDB } = require('./database/dbConfig');

const listUsers = async () => {
    await connectDB();
    
    const users = await User.findAll();
    
    console.log('All users in database:');
    users.forEach(user => {
        console.log(`- ID: ${user.id}, Email: "${user.userEmail}", Role: ${user.userRole}`);
    });
    
    process.exit(0);
};

listUsers().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
