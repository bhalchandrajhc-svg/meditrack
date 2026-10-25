const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const { saveVendorComplianceDetails } = require("../utils/vendorCompliance");

exports.signup = async (req, res) => {

    const { role, username, email, password } = req.body;

    try {

        const table = role === "vendor" ? "vendors" : "users";

        db.query(

            `SELECT * FROM ${table} WHERE email=?`,

            [email],

            async (err, result) => {

                if (err) {

                    return res.status(500).json(err);

                }

                if (result.length > 0) {

                    return res.status(400).json({

                        message: "Email already exists"

                    });

                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const otp = Math.floor(

                    100000 + Math.random() * 900000

                );

                if (role === "vendor") {

                    const insertVendor = `

                        INSERT INTO vendors

                        (

                            owner_name,

                            shop_name,

                            email,

                            mobile,

                            password,

                            license_number,

                            gst_number,

                            address,

                            city,

                            state,

                            pincode,

                            license_photo,

                            status,

                            is_verified

                        )

                        VALUES

                        (

                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0

                        )

                    `;

                    db.query(

                        insertVendor,

                        [
                            username,
                            req.body.shop_name,
                            email,
                            req.body.mobile,
                            hashedPassword,
                            req.body.license_number,
                            req.body.gst_number || "",
                            "",
                            "",
                            "",
                            req.files?.license_photo?.[0]?.filename || null,
                            ""
                        ],

                        async (err2, insertResult) => {

                            if (err2) {

                                return res.status(500).json(err2);

                            }

                            try {
                                await saveVendorComplianceDetails(insertResult.insertId, req.body);
                            } catch (detailsError) {
                                console.error("Vendor compliance details error:", detailsError);
                            }

                            req.app.get("io")?.emit("adminNotificationRefresh");

                            db.query(

                                "INSERT INTO otp_verification(email,otp) VALUES(?,?)",

                                [email, otp]

                            );

                            await sendEmail(

                                email,

                                "Medi Track OTP Verification",

                                `Welcome to Medi Track.\n\nYour OTP is ${otp}`

                            );

                            return res.json({

                                message:

                                    "Vendor registered successfully. Verify OTP."

                            });

                        }

                    );

                }

                else {

                    const insertUser = `

                        INSERT INTO users

                        (

                            username,

                            email,

                            password

                        )

                        VALUES

                        (

                            ?, ?, ?

                        )

                    `;

                    db.query(

                        insertUser,

                        [

                            username,

                            email,

                            hashedPassword

                        ],

                        async (err3) => {

                            if (err3) {

                                return res.status(500).json(err3);

                            }

                            db.query(

                                "INSERT INTO otp_verification(email,otp) VALUES(?,?)",

                                [email, otp]

                            );

                            await sendEmail(

                                email,

                                "Medi Track OTP Verification",

                                `Welcome to Medi Track.\n\nYour OTP is ${otp}`

                            );

                            return res.json({

                                message:

                                    "Signup successful. Verify OTP."

                            });

                        }

                    );

                }

            }

        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

exports.verifyOtp = (req, res) => {

    const { email, otp } = req.body;

    const checkOtp = `
        SELECT * FROM otp_verification
        WHERE email=? AND otp=?
    `;

    db.query(checkOtp, [email, otp], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // First try updating customer
        db.query(
            "UPDATE users SET is_verified=1 WHERE email=?",
            [email],
            (err1, userResult) => {

                if (err1) {
                    return res.status(500).json(err1);
                }

                // If no customer updated, update vendor
                if (userResult.affectedRows === 0) {

                    db.query(
                        "UPDATE vendors SET is_verified=1 WHERE email=?",
                        [email],
                        (err2) => {

                            if (err2) {
                                return res.status(500).json(err2);
                            }

                            return res.status(200).json({
                                message: "OTP Verified Successfully"
                            });

                        }
                    );

                } else {

                    sendEmail(
                        email,
                        "Welcome to Medi Track!",
                        `Hi,\n\nWelcome to Medi Track! Your account has been successfully verified. You can now log in and reserve medicines online.\n\nThank you for choosing us!`
                    ).catch(mailErr => console.error("Error sending welcome email:", mailErr));

                    return res.status(200).json({
                        message: "OTP Verified Successfully"
                    });

                }

            }
        );

    });

};

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

    const { role, email, password } = req.body;

    try {

        const table = role === "vendor" ? "vendors" : "users";

        db.query(

            `SELECT * FROM ${table} WHERE email=?`,

            [email],

            async (err, result) => {

                if (err) {

                    return res.status(500).json(err);

                }

                if (result.length === 0) {

                    return res.status(404).json({

                        message: `${role} not found`

                    });

                }

                const user = result[0];

                // OTP Verification

                if (user.is_verified == 0) {

                    return res.status(400).json({

                        message: "Please verify your OTP first."

                    });

                }

                // Vendor Approval

                if (role === "vendor") {

                    if (user.status === "Pending") {

                        return res.status(400).json({

                            message: "Your account is waiting for Admin Approval."

                        });

                    }

                    if (user.status === "Rejected") {

                        return res.status(400).json({

                            message: "Your account has been rejected."

                        });

                    }

                }

                // Password Check

                const match = await bcrypt.compare(

                    password,

                    user.password

                );

                if (!match) {

                    return res.status(400).json({

                        message: "Invalid Password"

                    });

                }

                // JWT Token

                const token = jwt.sign(

                    {

                        id: user.id,

                        email: user.email,

                        role

                    },

                    process.env.JWT_SECRET,

                    {

                        expiresIn: "1d"

                    }

                );

                if (role === "customer") {
                    sendEmail(
                        email,
                        "Medi Track Login Alert",
                        `Hi ${user.username || 'Customer'},\n\nWe detected a new login to your Medi Track customer account at ${new Date().toLocaleString()}.\n\nIf this was you, no action is needed. If you did not authorize this login, please contact support immediately.`
                    ).catch(mailErr => console.error("Error sending login email:", mailErr));
                }

                return res.status(200).json({

                    message: "Login Successful",

                    token,

                    user,

                    role

                });

            }

        );

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
