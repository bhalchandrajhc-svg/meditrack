const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadVendor");

const {
    signup,
    verifyOtp,
    login
} = require("../controllers/authController");

const {
    sendResetOtp,
    verifyResetOtp,
    resetPassword
} = require("../controllers/authResetController");

router.post("/signup", upload.fields([{ name: "license_photo", maxCount: 1 }]), signup);

router.post("/verify-otp", verifyOtp);

router.post("/login", login);

// ===============================
// Forgot & Reset Password Routes
// ===============================
router.post("/forgot-password/send-otp", sendResetOtp);
router.post("/forgot-password/verify-otp", verifyResetOtp);
router.post("/forgot-password/reset-password", resetPassword);

module.exports = router;
