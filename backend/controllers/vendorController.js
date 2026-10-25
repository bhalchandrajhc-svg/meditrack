const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { ensureComplianceTable, saveVendorComplianceDetails } = require("../utils/vendorCompliance");

// =================================
// Email Transport
// =================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =================================
// Register Vendor
// =================================

exports.registerVendor = async (req, res) => {

    try {

        const {
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
            latitude,
            longitude
            ,vendor_legal_name,
            business_type,
            primary_contact_person,
            regulatory_certifications,
            bank_account_details
        } = req.body;

        // Check Existing Email
        db.query(
            "SELECT id FROM vendors WHERE email = ?",
            [email],
            async (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already registered."
                    });
                }

                // Password Hash
                const hashedPassword = await bcrypt.hash(password, 10);

                const shopPhoto =
                    req.files?.shop_photo?.[0]?.filename || null;

                const licensePhoto =
                    req.files?.license_photo?.[0]?.filename || null;

                const sql = `
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
                        latitude,
                        longitude,
                        shop_photo,
                        license_photo,
                        status,
                        is_verified
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                `;

                const values = [
                    owner_name,
                    shop_name,
                    email,
                    mobile,
                    hashedPassword,
                    license_number,
                    gst_number,
                    address,
                    city,
                    state,
                    pincode,
                    latitude,
                    longitude,
                    shopPhoto,
                    licensePhoto,
                    "Pending",
                    0
                ];

                db.query(sql, values, async (err, insertResult) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            message: "Registration Failed"
                        });
                    }

                    try {
                        await saveVendorComplianceDetails(insertResult.insertId, {
                            vendor_legal_name,
                            business_type,
                            primary_contact_person,
                            regulatory_certifications,
                            bank_account_details
                        });
                    } catch (detailsError) {
                        console.error("Vendor compliance details error:", detailsError);
                    }

                    req.app.get("io")?.emit("adminNotificationRefresh");

                    // Welcome Email
                    try {

                        await transporter.sendMail({

                            from: process.env.EMAIL_USER,
                            to: email,
                            subject: "Vendor Registration Received",

                            html: `
                                <h2>Welcome to Medi Track</h2>

                                <p>Hello <b>${owner_name}</b>,</p>

                                <p>Your pharmacy registration has been received successfully.</p>

                                <p>Your account is currently
                                <b>Pending Admin Approval</b>.</p>

                                <p>You will receive another email after approval.</p>

                                <br>

                                <p>Thank You.</p>
                            `

                        });

                    } catch (mailErr) {

                        console.log("Mail Error:", mailErr);

                    }

                    return res.status(201).json({
                        success: true,
                        message: "Vendor Registered Successfully"
                    });

                });

            }

        );

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// =================================
// Vendor Login
// =================================

exports.loginVendor = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });

    }

    db.query(

        "SELECT * FROM vendors WHERE email = ?",

        [email],

        async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Vendor not found"
                });

            }

            const vendor = result[0];

            const isMatch = await bcrypt.compare(
                String(password).trim(),
                vendor.password
            );

            if (!isMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid Password"
                });

            }

            if (vendor.status !== "Approved") {

                return res.status(403).json({
                    success: false,
                    message: "Your account is waiting for admin approval."
                });

            }

            const token = jwt.sign(
                {
                    id: vendor.id,
                    role: "vendor"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return res.status(200).json({

                success: true,
                message: "Login Successful",
                token,

                vendor: {
                    id: vendor.id,
                    owner_name: vendor.owner_name,
                    shop_name: vendor.shop_name,
                    email: vendor.email,
                    mobile: vendor.mobile,
                    shop_photo: vendor.shop_photo
                }

            });

        }

    );

};

// =================================
// Get Vendor Profile
// =================================

exports.getVendorProfile = async (req, res) => {

    const vendorId = req.params.id;

    try {
        await ensureComplianceTable();
    } catch (error) {
        console.error("Vendor compliance table error:", error);
        return res.status(500).json({ success: false, message: "Database Error" });
    }

    const sql = `
        SELECT
            v.id, v.owner_name, v.shop_name, v.email, v.mobile, v.license_number,
            v.gst_number, v.address, v.city, v.state, v.pincode, v.latitude,
            v.longitude, v.shop_photo, v.license_photo, v.status,
            c.vendor_legal_name, c.business_type, c.primary_contact_person,
            c.regulatory_certifications, c.bank_account_details
        FROM vendors v
        LEFT JOIN vendor_compliance_details c ON c.vendor_id = v.id
        WHERE v.id = ?
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        return res.json(result[0]);

    });

};

// =================================
// Update Vendor Profile
// =================================

exports.updateVendorProfile = async (req, res) => {

    const vendorId = req.params.id;

    const body = req.body || {};

    const getValue = (value) =>
        Array.isArray(value) ? value[0] : value || "";

    const values = [
        getValue(body.owner_name),
        getValue(body.shop_name),
        getValue(body.email),
        getValue(body.mobile),
        getValue(body.license_number),
        getValue(body.gst_number),
        getValue(body.address),
        getValue(body.city),
        getValue(body.state),
        getValue(body.pincode),
        getValue(body.latitude),
        getValue(body.longitude)
    ];

    if (
        !values[0] ||
        !values[1] ||
        !values[2] ||
        !values[3]
    ) {

        return res.status(400).json({
            success: false,
            message: "Required fields are missing."
        });

    }

    let sql = `
        UPDATE vendors
        SET
            owner_name=?,
            shop_name=?,
            email=?,
            mobile=?,
            license_number=?,
            gst_number=?,
            address=?,
            city=?,
            state=?,
            pincode=?,
            latitude=?,
            longitude=?
    `;

    const shopPhoto = req.files?.shop_photo?.[0] || req.file;
    const licensePhoto = req.files?.license_photo?.[0];

    if (shopPhoto) {
        sql += ", shop_photo=?";
        values.push(shopPhoto.filename);
    }

    if (licensePhoto) {
        sql += ", license_photo=?";
        values.push(licensePhoto.filename);
    }

    sql += " WHERE id=?";
    values.push(vendorId);

    db.query(sql, values, async (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Update Failed"
            });

        }

        try {
            await saveVendorComplianceDetails(vendorId, body);
        } catch (detailsError) {
            console.error("Vendor compliance details update error:", detailsError);
            return res.status(500).json({ success: false, message: "Compliance details update failed" });
        }

        return res.json({
            success: true,
            message: "Vendor Profile Updated Successfully"
        });

    });

};

// =================================
// Change Password
// =================================

exports.changePassword = (req, res) => {

    const vendorId = req.params.id;

    const {
        currentPassword,
        newPassword
    } = req.body;

    db.query(
        "SELECT password FROM vendors WHERE id=?",
        [vendorId],
        async (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Vendor not found"
                });

            }

            const isMatch = await bcrypt.compare(
                currentPassword,
                result[0].password
            );

            if (!isMatch) {

                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect"
                });

            }

            const hashedPassword =
                await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE vendors SET password=? WHERE id=?",
                [hashedPassword, vendorId],
                (err) => {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: "Password Update Failed"
                        });

                    }

                    return res.json({
                        success: true,
                        message: "Password Changed Successfully"
                    });

                }
            );

        }
    );

};

// =================================
// Get Approved Pharmacies
// =================================

exports.getNearbyPharmacies = (req, res) => {

    const sql = `
        SELECT
            id,
            shop_name,
            owner_name,
            mobile,
            address,
            city,
            state,
            shop_photo
        FROM vendors
        WHERE status='Approved'
        ORDER BY shop_name ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result);

    });

};
