const express = require("express");
const router = express.Router();
const totp = require("../controllers/otpAPI");

router.route("/otp-api").post(totp.otpApi);

module.exports = router;
