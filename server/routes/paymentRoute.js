const express = require("express");
const { initiatePayment, paymentStatus } = require("../controller/paymentController");
const Transaction = require("../model/paymentModel");

const router = express.Router();

router.post("/initiate-payment", initiatePayment);

router.post("/payment-status", paymentStatus);

module.exports = router;