const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ensureComplianceTable } = require("../utils/vendorCompliance");
const { ensureAdminTable } = require("./authResetController");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Admin login is required" });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
        req.admin = user;
        next();
    } catch {
        return res.status(401).json({ message: "Your admin session has expired" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        await ensureAdminTable();
        const cleanEmail = email.trim().toLowerCase();

        db.query("SELECT * FROM admin_auth WHERE LOWER(email) = ?", [cleanEmail], async (err, rows) => {
            if (err) {
                console.error("Admin login query error:", err);
                return res.status(500).json({ message: "Server error during login" });
            }

            if (rows && rows.length > 0) {
                const adminRecord = rows[0];
                const match = await bcrypt.compare(password, adminRecord.password);
                if (match || password === adminRecord.password) {
                    const token = jwt.sign({ email: adminRecord.email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
                    return res.json({ message: "Admin login successful", token, admin: { email: adminRecord.email, name: "Administrator" } });
                }
                return res.status(401).json({ message: "Invalid admin email or password" });
            }

            // Fallback to environment variables
            if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
                // Seed admin_auth table with hashed password
                try {
                    const hashed = await bcrypt.hash(password, 10);
                    db.query("INSERT IGNORE INTO admin_auth (email, password) VALUES (?, ?)", [ADMIN_EMAIL, hashed]);
                } catch (seedErr) {
                    console.error("Admin seed error:", seedErr);
                }

                const token = jwt.sign({ email: ADMIN_EMAIL, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
                return res.json({ message: "Admin login successful", token, admin: { email: ADMIN_EMAIL, name: "Administrator" } });
            }

            return res.status(401).json({ message: "Invalid admin email or password" });
        });
    } catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ message: "Server error during admin login" });
    }
};

exports.getDashboard = (req, res) => {
    const summarySql = `SELECT (SELECT COUNT(*) FROM vendors) AS totalVendors, (SELECT COUNT(*) FROM users) AS totalCustomers, (SELECT COUNT(*) FROM vendors WHERE status = 'Pending') AS pendingVendors`;
    const vendorsSql = `SELECT id, owner_name, shop_name, email, mobile, city, state, status FROM vendors ORDER BY CASE status WHEN 'Pending' THEN 0 WHEN 'Rejected' THEN 1 ELSE 2 END, id DESC`;
    db.query(summarySql, (summaryError, summaryRows) => {
        if (summaryError) return res.status(500).json({ message: "Could not load dashboard data" });
        db.query(vendorsSql, (vendorsError, vendors) => {
            if (vendorsError) return res.status(500).json({ message: "Could not load vendor requests" });
            return res.json({ ...summaryRows[0], vendors });
        });
    });
};

exports.updateVendorStatus = (req, res) => {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Status must be Approved or Rejected" });
    db.query("UPDATE vendors SET status = ? WHERE id = ?", [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Could not update vendor status" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Vendor not found" });
        return res.json({ message: `Vendor ${status.toLowerCase()} successfully` });
    });
};

exports.getVendorDetails = async (req, res) => {
    try {
        await ensureComplianceTable();
    } catch (error) {
        console.error("Vendor compliance table error:", error);
        return res.status(500).json({ message: "Could not load vendor information" });
    }

    const sql = `
        SELECT v.id, v.owner_name, v.shop_name, v.email, v.mobile, v.license_number, v.gst_number,
               v.address, v.city, v.state, v.pincode, v.latitude, v.longitude, v.shop_photo,
               v.license_photo, v.status, v.is_verified, c.vendor_legal_name, c.business_type,
               c.primary_contact_person, c.regulatory_certifications, c.bank_account_details
        FROM vendors v
        LEFT JOIN vendor_compliance_details c ON c.vendor_id = v.id
        WHERE v.id = ?
    `;

    db.query(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Could not load vendor information" });
        if (rows.length === 0) return res.status(404).json({ message: "Vendor not found" });
        return res.json(rows[0]);
    });
};

exports.getNotifications = (req, res) => {
    const sql = `
        SELECT id, shop_name, owner_name, email, mobile
        FROM vendors
        WHERE status = 'Pending'
        ORDER BY id DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ message: "Could not load admin notifications" });

        const notifications = rows.map((vendor) => ({
            id: vendor.id,
            title: "New vendor registration",
            message: `${vendor.shop_name} (${vendor.owner_name}) is waiting for approval.`,
            vendor
        }));

        return res.json(notifications);
    });
};

exports.requireAdmin = requireAdmin;
