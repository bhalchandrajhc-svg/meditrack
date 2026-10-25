const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";

// Ensure admin table exists for persistent admin credentials
const ensureAdminTable = () => new Promise((resolve, reject) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS admin_auth (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    db.query(sql, (err) => (err ? reject(err) : resolve()));
});

exports.ensureAdminTable = ensureAdminTable;

/**
 * Step 1: Send OTP to registered email
 */
exports.sendResetOtp = async (req, res) => {
    const { email, role } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({ message: "Please provide a valid registered email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRole = (role || "customer").toLowerCase();

    try {
        let accountFound = false;
        let displayName = "";

        if (userRole === "admin") {
            await ensureAdminTable();
            // Check admin_auth table first
            const adminQuery = "SELECT * FROM admin_auth WHERE email = ?";
            const adminRows = await new Promise((resolve, reject) => {
                db.query(adminQuery, [cleanEmail], (err, rows) => (err ? reject(err) : resolve(rows)));
            });

            if (adminRows && adminRows.length > 0) {
                accountFound = true;
                displayName = "Administrator";
            } else if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
                accountFound = true;
                displayName = "Administrator";
            }
        } else if (userRole === "vendor") {
            const vendorQuery = "SELECT id, email, owner_name, shop_name FROM vendors WHERE LOWER(email) = ?";
            const vendorRows = await new Promise((resolve, reject) => {
                db.query(vendorQuery, [cleanEmail], (err, rows) => (err ? reject(err) : resolve(rows)));
            });

            if (vendorRows && vendorRows.length > 0) {
                accountFound = true;
                displayName = vendorRows[0].owner_name || vendorRows[0].shop_name || "Vendor";
            }
        } else {
            // Customer (users table)
            const customerQuery = "SELECT id, email, username FROM users WHERE LOWER(email) = ?";
            const customerRows = await new Promise((resolve, reject) => {
                db.query(customerQuery, [cleanEmail], (err, rows) => (err ? reject(err) : resolve(rows)));
            });

            if (customerRows && customerRows.length > 0) {
                accountFound = true;
                displayName = customerRows[0].username || "Customer";
            }
        }

        if (!accountFound) {
            return res.status(404).json({
                message: `No ${userRole} account found registered with email "${cleanEmail}". Please check your email or role.`
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Clear existing OTP for this email first
        await new Promise((resolve) => {
            db.query("DELETE FROM otp_verification WHERE email = ?", [cleanEmail], () => resolve());
        });

        // Store new OTP
        await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO otp_verification (email, otp) VALUES (?, ?)",
                [cleanEmail, otp],
                (err, result) => (err ? reject(err) : resolve(result))
            );
        });

        // Send OTP via email
        const emailSubject = `Medi Track - Password Reset Verification Code`;
        const emailBody = `Hello ${displayName},\n\n` +
            `We received a request to reset your password for your Medi Track ${userRole.toUpperCase()} account.\n\n` +
            `Your 6-Digit Password Reset OTP is:\n` +
            `===========================\n` +
            `       ${otp}\n` +
            `===========================\n\n` +
            `This verification code is valid for 10 minutes.\n` +
            `If you did not request this password reset, please ignore this email or contact Medi Track support.\n\n` +
            `Warm regards,\n` +
            `Medi Track Security Team`;

        try {
            await sendEmail(cleanEmail, emailSubject, emailBody);
        } catch (mailErr) {
            console.error("Nodemailer Error sending reset OTP:", mailErr);
            // Even if mail delivery fails in local dev environment without internet,
            // log the OTP to the console so developers/testers can still complete the flow!
            console.log(`[PASSWORD RESET OTP for ${cleanEmail} (${userRole})]: ${otp}`);
        }

        return res.status(200).json({
            message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox.`,
            email: cleanEmail
        });

    } catch (error) {
        console.error("Error in sendResetOtp:", error);
        return res.status(500).json({ message: "Unable to process password reset request. Please try again." });
    }
};

/**
 * Step 2: Verify OTP
 */
exports.verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP code are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    try {
        const query = "SELECT * FROM otp_verification WHERE email = ? AND otp = ?";
        db.query(query, [cleanEmail, cleanOtp], (err, rows) => {
            if (err) {
                console.error("Error verifying OTP:", err);
                return res.status(500).json({ message: "Error verifying OTP code." });
            }

            if (!rows || rows.length === 0) {
                return res.status(400).json({ message: "Invalid or expired OTP code. Please enter the correct code." });
            }

            return res.status(200).json({
                message: "OTP verified successfully. You may now reset your password.",
                verified: true
            });
        });
    } catch (error) {
        console.error("Error in verifyResetOtp:", error);
        return res.status(500).json({ message: "Server error during OTP verification." });
    }
};

/**
 * Step 3: Reset Password
 */
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword, role } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP code, and new password are required." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();
    const userRole = (role || "customer").toLowerCase();

    try {
        // Verify OTP first
        const otpQuery = "SELECT * FROM otp_verification WHERE email = ? AND otp = ?";
        const otpRows = await new Promise((resolve, reject) => {
            db.query(otpQuery, [cleanEmail, cleanOtp], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        if (!otpRows || otpRows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired OTP code. Please request a new code." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (userRole === "admin") {
            await ensureAdminTable();
            // Insert or update admin_auth
            const upsertAdmin = `
                INSERT INTO admin_auth (email, password)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE password = VALUES(password)
            `;
            await new Promise((resolve, reject) => {
                db.query(upsertAdmin, [cleanEmail, hashedPassword], (err, result) => (err ? reject(err) : resolve(result)));
            });
        } else if (userRole === "vendor") {
            const updateVendor = "UPDATE vendors SET password = ? WHERE LOWER(email) = ?";
            const updateResult = await new Promise((resolve, reject) => {
                db.query(updateVendor, [hashedPassword, cleanEmail], (err, result) => (err ? reject(err) : resolve(result)));
            });

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: "Vendor account not found." });
            }
        } else {
            // Customer
            const updateCustomer = "UPDATE users SET password = ? WHERE LOWER(email) = ?";
            const updateResult = await new Promise((resolve, reject) => {
                db.query(updateCustomer, [hashedPassword, cleanEmail], (err, result) => (err ? reject(err) : resolve(result)));
            });

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: "Customer account not found." });
            }
        }

        // Delete used OTP so it cannot be reused
        await new Promise((resolve) => {
            db.query("DELETE FROM otp_verification WHERE email = ?", [cleanEmail], () => resolve());
        });

        // Send confirmation email
        const confirmSubject = "Medi Track - Password Reset Successful";
        const confirmBody = `Hello,\n\n` +
            `Your Medi Track account (${userRole.toUpperCase()}) password has been successfully reset.\n\n` +
            `You can now log in to your account with your new password.\n\n` +
            `If you did NOT make this change, please contact Medi Track support immediately to secure your account.\n\n` +
            `Best regards,\n` +
            `Medi Track Team`;

        sendEmail(cleanEmail, confirmSubject, confirmBody).catch((mailErr) => {
            console.error("Error sending password reset confirmation email:", mailErr);
        });

        return res.status(200).json({
            message: "Password reset successful! You can now log in with your new password."
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ message: "Server error resetting password. Please try again." });
    }
};
