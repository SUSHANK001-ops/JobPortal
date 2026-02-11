const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require('../controller/userController');
const { asyncError } = require('../services/asyncErrro');


const router = require('express').Router();

router.route("/register").post(asyncError(registerUser))
router.route("/login").post(asyncError(loginUser))
router.route("/forgot-password").post(asyncError(forgotPassword))
router.route("/verify-otp").post(asyncError(verifyOtp))
router.route("/reset-password").post(asyncError(resetPassword))





module.exports = router;