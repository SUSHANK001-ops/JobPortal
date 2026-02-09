const { User } = require("./model")
const bcrypt = require('bcrypt');




const seedAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminEmail || !adminPassword) {
        console.log("Admin email or password not found in .env");
        return;
    }

    const userAdmin = await User.findOne({
        where: { userEmail: adminEmail }
    })

    // If admin user already exists, do not create again
    if (userAdmin) {
        console.log("Admin user already exists!");
        return;
    }

    // Create admin user
    await User.create({
        username: "Sushank",
        userEmail: adminEmail,
        userPassword: bcrypt.hashSync(adminPassword, 10),
        userRole: "jobProvider"
    })
    console.log("Admin user created successfully!");
}

module.exports = seedAdminUser;