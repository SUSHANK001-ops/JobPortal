// middleware is a function that has access to the request and response objects.
const jwt = require('jsonwebtoken');
const { User } = require('../model');

// middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {

    // token receive
    let token = req.headers.authorization

    // token check
    if (!token) {
        return res.status(400).json({
            message: "Unauthorized access"
        })
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7)
    }

    // token verify
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).json({
                message: "Invalid token"
            })
        } else {
            const userId = decoded.userId

            // Check the user with the id from token

            const user = await User.findByPk(userId)

            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                })
            }
            req.user = user

            next()
        }
    })
}

// check user role

const checkUserRole = (...roles) => { // rest operator=> Rest operator allows a function to accept an indefinite number of arguments as an array.
    return (req, res, next) => {
        const userRole = req.user.userRole
        if (!roles.includes(userRole)) {
            return res.status(400).json({
                message: "Unauthorized access - role mismatch"
            })
        }else{
            next()
        }
    }
}



module.exports = {
    isAuthenticated,
    checkUserRole
}


// checkRole("JobProvider", "jobSeeker")
// role = ["jobProvider"]