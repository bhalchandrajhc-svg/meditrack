const db = require("../config/db");

// ===========================
// Get All Medicines
// ===========================

exports.getMedicines = (req, res) => {

    const search = req.query.search || "";

    const sql = `
        SELECT
            m.id,
            m.vendor_id,
            m.name,
            m.company,
            m.category,
            m.description,
            m.price,
            m.stock,
            m.status,
            m.visible,
            m.image,
            v.shop_name,
            v.mobile,
            v.address,
            v.city

        FROM medicines m

        INNER JOIN vendors v
            ON m.vendor_id = v.id

        WHERE
            m.visible = 1
            AND (
                m.name LIKE ?
                OR m.company LIKE ?
                OR m.category LIKE ?
            )

        ORDER BY m.name ASC
    `;

    db.query(

        sql,

        [
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            res.json(result);

        }

    );

};

// ===========================
// Get Single Medicine
// ===========================

exports.getMedicineById = (req, res) => {

    const id = req.params.id;
    const userLat = parseFloat(req.query.latitude);
    const userLng = parseFloat(req.query.longitude);
    const hasCoordinates = !Number.isNaN(userLat) && !Number.isNaN(userLng);

    let sql = `
        SELECT
            m.*,
            v.shop_name,
            v.mobile,
            v.address,
            v.city,
            v.state,
            v.pincode,
            v.latitude,
            v.longitude
    `;

    const params = [];

    if (hasCoordinates) {
        sql += `,
            ROUND(
                6371 * ACOS(
                    LEAST(
                        1,
                        GREATEST(
                            -1,
                            COS(RADIANS(?))
                            * COS(RADIANS(v.latitude))
                            * COS(
                                RADIANS(v.longitude)
                                - RADIANS(?)
                            )
                            +
                            SIN(RADIANS(?))
                            * SIN(RADIANS(v.latitude))
                        )
                    )
                ),
                1
            ) AS distance
        `;
        params.push(userLat, userLng, userLat);
    }

    sql += `
        FROM medicines m

        INNER JOIN vendors v
            ON m.vendor_id = v.id

        WHERE m.id = ?
    `;
    params.push(id);

    db.query(sql, params, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Medicine Not Found"
            });

        }

        res.json(result[0]);

    });

};

// ===========================
// Get Medicines By Vendor
// ===========================

exports.getMedicinesByVendor = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            id,
            name,
            company,
            category,
            price,
            stock,
            status,
            image

        FROM medicines

        WHERE
            vendor_id = ?
            AND visible = 1

        ORDER BY name ASC
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Server Error"
            });

        }

        res.json(result);

    });

};

// ===========================
// Get Nearby Pharmacies
// ===========================

exports.getNearbyPharmacies = (req, res) => {

    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const radiusParam = req.query.radius;

    const hasLocation = !Number.isNaN(latitude) && !Number.isNaN(longitude);
    const isAllRadius = !radiusParam || radiusParam === "all" || radiusParam === "ALL" || radiusParam === "0" || radiusParam === 0;
    const radius = isAllRadius ? null : parseFloat(radiusParam);

    let sql = "";
    let params = [];

    if (hasLocation) {
        if (radius !== null && !Number.isNaN(radius) && radius > 0) {
            sql = `
                SELECT
                    v.id,
                    v.owner_name,
                    v.shop_name,
                    v.email,
                    v.mobile,
                    v.address,
                    v.city,
                    v.state,
                    v.pincode,
                    v.latitude,
                    v.longitude,
                    v.shop_photo,
                    v.opening_time,
                    v.closing_time,
                    CASE
                        WHEN v.latitude IS NOT NULL
                             AND v.longitude IS NOT NULL
                             AND (v.latitude != 0 OR v.longitude != 0)
                        THEN (
                            6371 * ACOS(
                                LEAST(
                                    1,
                                    GREATEST(
                                        -1,
                                        COS(RADIANS(?))
                                        * COS(RADIANS(v.latitude))
                                        * COS(
                                            RADIANS(v.longitude)
                                            - RADIANS(?)
                                        )
                                        +
                                        SIN(RADIANS(?))
                                        * SIN(RADIANS(v.latitude))
                                    )
                                )
                            )
                        )
                        ELSE NULL
                    END AS distance
                FROM vendors v
                WHERE v.status = 'Approved'
                HAVING distance IS NOT NULL AND distance <= ?
                ORDER BY distance ASC
            `;
            params = [latitude, longitude, latitude, radius];
        } else {
            // Show all approved vendors, with distance calculated if coordinates are present
            sql = `
                SELECT
                    v.id,
                    v.owner_name,
                    v.shop_name,
                    v.email,
                    v.mobile,
                    v.address,
                    v.city,
                    v.state,
                    v.pincode,
                    v.latitude,
                    v.longitude,
                    v.shop_photo,
                    v.opening_time,
                    v.closing_time,
                    CASE
                        WHEN v.latitude IS NOT NULL
                             AND v.longitude IS NOT NULL
                             AND (v.latitude != 0 OR v.longitude != 0)
                        THEN (
                            6371 * ACOS(
                                LEAST(
                                    1,
                                    GREATEST(
                                        -1,
                                        COS(RADIANS(?))
                                        * COS(RADIANS(v.latitude))
                                        * COS(
                                            RADIANS(v.longitude)
                                            - RADIANS(?)
                                        )
                                        +
                                        SIN(RADIANS(?))
                                        * SIN(RADIANS(v.latitude))
                                    )
                                )
                            )
                        )
                        ELSE NULL
                    END AS distance
                FROM vendors v
                WHERE v.status = 'Approved'
                ORDER BY CASE WHEN distance IS NULL THEN 1 ELSE 0 END, distance ASC, v.shop_name ASC
            `;
            params = [latitude, longitude, latitude];
        }
    } else {
        // Fallback when GPS location is not available - return all approved vendors
        sql = `
            SELECT
                v.id,
                v.owner_name,
                v.shop_name,
                v.email,
                v.mobile,
                v.address,
                v.city,
                v.state,
                v.pincode,
                v.latitude,
                v.longitude,
                v.shop_photo,
                v.opening_time,
                v.closing_time,
                NULL AS distance
            FROM vendors v
            WHERE v.status = 'Approved'
            ORDER BY v.shop_name ASC
        `;
        params = [];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Nearby Pharmacy Error:", err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        const pharmacies = result.map((pharmacy) => ({
            ...pharmacy,
            distance: pharmacy.distance !== null && pharmacy.distance !== undefined
                ? Number(pharmacy.distance).toFixed(2)
                : null
        }));

        return res.status(200).json({
            success: true,
            count: pharmacies.length,
            radius: isAllRadius ? "all" : radius,
            pharmacies
        });
    });

};

// ===========================
// Get Customer Profile
// ===========================

exports.getCustomerProfile = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            u.id AS user_id,
            u.username,
            u.email,

            cp.mobile,
            cp.gender,
            cp.dob,
            cp.blood_group,
            cp.address,
            cp.city,
            cp.state,
            cp.pincode,
            cp.profile_photo

        FROM users u

        LEFT JOIN customer_profiles cp
            ON cp.user_id = u.id

        WHERE u.id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.error(
                "Get Customer Profile Error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Customer Not Found"
            });

        }

        return res.status(200).json({
            success: true,
            profile: result[0]
        });

    });

};


// ===========================
// Update Customer Profile
// ===========================

exports.updateCustomerProfile = (req, res) => {

    const userId = req.params.userId;

    const {
        username,
        mobile,
        gender,
        dob,
        blood_group,
        address,
        city,
        state,
        pincode
    } = req.body;


    // ===========================
    // Update Username
    // ===========================

    const updateUserSql = `
        UPDATE users
        SET username = ?
        WHERE id = ?
    `;

    db.query(
        updateUserSql,
        [username, userId],
        (userErr) => {

            if (userErr) {

                console.error(
                    "Update User Error:",
                    userErr
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to update customer"
                });

            }


            // ===========================
            // Check Profile Exists
            // ===========================

            const checkSql = `
                SELECT id
                FROM customer_profiles
                WHERE user_id = ?
            `;

            db.query(
                checkSql,
                [userId],
                (checkErr, result) => {

                    if (checkErr) {

                        console.error(
                            "Profile Check Error:",
                            checkErr
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Database Error"
                        });

                    }


                    // ===========================
                    // Profile Exists -> UPDATE
                    // ===========================

                    if (result.length > 0) {

                        const updateProfileSql = `
                            UPDATE customer_profiles
                            SET
                                mobile = ?,
                                gender = ?,
                                dob = ?,
                                blood_group = ?,
                                address = ?,
                                city = ?,
                                state = ?,
                                pincode = ?
                            WHERE user_id = ?
                        `;

                        db.query(
                            updateProfileSql,
                            [
                                mobile || null,
                                gender || null,
                                dob || null,
                                blood_group || null,
                                address || null,
                                city || null,
                                state || null,
                                pincode || null,
                                userId
                            ],
                            (updateErr) => {

                                if (updateErr) {

                                    console.error(
                                        "Update Profile Error:",
                                        updateErr
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Profile Update Failed"
                                    });

                                }

                                return res.status(200).json({
                                    success: true,
                                    message: "Profile Updated Successfully"
                                });

                            }
                        );

                    }

                    // ===========================
                    // Profile Doesn't Exist
                    // -> INSERT
                    // ===========================

                    else {

                        const insertProfileSql = `
                            INSERT INTO customer_profiles
                            (
                                user_id,
                                mobile,
                                gender,
                                dob,
                                blood_group,
                                address,
                                city,
                                state,
                                pincode
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                        db.query(
                            insertProfileSql,
                            [
                                userId,
                                mobile || null,
                                gender || null,
                                dob || null,
                                blood_group || null,
                                address || null,
                                city || null,
                                state || null,
                                pincode || null
                            ],
                            (insertErr) => {

                                if (insertErr) {

                                    console.error(
                                        "Insert Profile Error:",
                                        insertErr
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Profile Creation Failed"
                                    });

                                }

                                return res.status(200).json({
                                    success: true,
                                    message: "Profile Updated Successfully"
                                });

                            }
                        );

                    }

                }
            );

        }
    );

};