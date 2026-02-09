const express = require("express");
const { initiatePayment, paymentStatus } = require("../controller/paymentController");
const { asyncError } = require("../services/asyncErrro");

const router = express.Router();

router.post("/initiate-payment", asyncError(initiatePayment));

router.post("/payment-status", asyncError(paymentStatus));

module.exports = router;