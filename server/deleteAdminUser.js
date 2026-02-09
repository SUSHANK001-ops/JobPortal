require('dotenv').config();
const { User } = require("./model");
const { connectDB } = require('./database/dbConfig');

const deleteAdminUser = async () => {
    await connectDB();
    
    // Delete all admin users (including the one with space)
    const deleted = await User.destroy({
        where: { userRole: "jobProvider" }
    });
    
    console.log(`Deleted ${deleted} admin user(s)`);
    process.exit(0);
};

deleteAdminUser().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
