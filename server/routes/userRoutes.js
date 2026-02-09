const { registerUser, loginUser } = require('../controller/userController');
const { asyncError } = require('../services/asyncErrro');


const router = require('express').Router();

router.route("/register").post(asyncError(registerUser))
router.route("/login").post(asyncError(loginUser))






module.exports = router;