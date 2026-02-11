const User = require("../model/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require("../services/sendEmail");

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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await User.create({
        username,
        userEmail,
        userPassword: bcrypt.hashSync(userPassword, 10),
        userRole: userRole || "jobSeeker",
        otp: otp
    })

    await sendEmail({
        email: userEmail,
        subject: "Account Verification OTP",
        message: `Your OTP for account verification is: ${otp}`,
    });

    return res.status(201).json({
        message: "User registered successfully. Please verify your email."
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

    // Check if verified
    if (!isExistingUser.isVerified) {
        return res.status(403).json({
            message: "Account not verified. Please verify your email first."
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { userEmail: email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail({
        email,
        subject: "Password Reset OTP",
        message: `Your OTP for password reset is: ${otp}`,
    });

    return res.status(200).json({
        message: "OTP sent to email",
    });
};

// verify otp 
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            message: "Please provide email and otp"
        });
    }

    const user = await User.findOne({ where: { userEmail: email } });
    if (!user) {
        return res.status(404).json({
            message: "Email is not registered"
        });
    }

    if (user.otp !== otp.toString()) {
        return res.status(400).json({
            message: "Invalid otp"
        });
    } else {
        user.otp = null;
        user.isOtpVerified = true;
        user.isVerified = true; // Set verified to true
        await user.save();
        return res.status(200).json({
            message: "Otp is correct"
        });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "Please provide email, newPassword, and confirmPassword"
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "newPassword and confirmPassword doesn't match"
        });
    }

    const user = await User.findOne({ where: { userEmail: email } });
    if (!user) {
        return res.status(404).json({
            message: "User email not registered"
        });
    }

    if (user.isOtpVerified !== true) {
        return res.status(403).json({
            message: "You cannot perform this action. Verify OTP first."
        });
    }

    user.userPassword = bcrypt.hashSync(newPassword, 10);
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
        message: "Password changed successfully"
    });
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword
};