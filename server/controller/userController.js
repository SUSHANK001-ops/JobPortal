const User = require("../model/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user -> register user
const registerUser = async (req, res) => {
    // taking data from req body

    
    const { username, userEmail, userPassword, userRole } = req.body

    if (!username || !userEmail || !userPassword) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // Check if user already exists
    const isExistingUser = await User.findOne({ where: { userEmail } }) // returns object or null

    if (isExistingUser) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    // Create user
    await User.create({
        username,
        userEmail,
        userPassword: bcrypt.hashSync(userPassword, 10),
        userRole: userRole || "jobSeeker"
    })
    return res.status(201).json({
        message: "User registered successfully"
    })
}

// Login User

const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body
    if (!userEmail || !userPassword) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // Check if user exists
    const isExistingUser = await User.findOne({ where: { userEmail } }) // returns object or null

    if (!isExistingUser) {
        return res.status(400).json({
            message: "User does not exist"
        })
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(userPassword, isExistingUser.userPassword)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    // Generate JWT Token
    const token = jwt.sign({userId: isExistingUser.id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })

    return res.status(200).json({
        message: "User logged in successfully",
        token: token,
        user: {
            id: isExistingUser.id,
            username: isExistingUser.username,
            userEmail: isExistingUser.userEmail,
            userRole: isExistingUser.userRole
        }
    })
}

module.exports = {
    registerUser,
    loginUser
}