const db = require("../config/db");

// ======================================
// Get Vendor Medicines
// ======================================

exports.getMedicines = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT *
        FROM medicines
        WHERE vendor_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [vendorId], (err, result) => {

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

// ======================================
// Get Single Medicine
// ======================================

exports.getMedicine = (req, res) => {

    const sql = `
        SELECT *
        FROM medicines
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {

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
                message: "Medicine Not Found"
            });

        }

        return res.json(result[0]);

    });

};

// ======================================
// Add Medicine
// ======================================

exports.addMedicine = (req, res) => {

    const {
        vendor_id,
        name,
        company,
        category,
        description,
        price,
        stock,
        status,
        visible
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO medicines
        (
            vendor_id,
            name,
            company,
            category,
            description,
            price,
            stock,
            status,
            visible,
            image
        )
        VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(

        sql,

        [
            vendor_id,
            name,
            company,
            category,
            description,
            price,
            stock,
            status,
            visible,
            image
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            const notificationSql = `
                INSERT INTO notifications
                (
                    vendor_id,
                    title,
                    message,
                    type
                )
                VALUES (?,?,?,?)
            `;

            db.query(

                notificationSql,

                [
                    vendor_id,
                    "Medicine Added",
                    `${name} medicine added successfully.`,
                    "success"
                ],

                (notifyErr) => {

                    if (notifyErr) {

                        console.log("Notification Error:", notifyErr);

                    }

                    return res.status(201).json({

                        success: true,
                        message: "Medicine Added Successfully",
                        medicineId: result.insertId

                    });

                }

            );

        }

    );

};

// ======================================
// Update Medicine
// ======================================

exports.updateMedicine = (req, res) => {

    const {
        name,
        company,
        category,
        description,
        price,
        stock,
        status,
        visible
    } = req.body;

    let sql;
    let values;

    if (req.file) {

        sql = `
            UPDATE medicines
            SET
                name=?,
                company=?,
                category=?,
                description=?,
                price=?,
                stock=?,
                status=?,
                visible=?,
                image=?
            WHERE id=?
        `;

        values = [
            name,
            company,
            category,
            description,
            price,
            stock,
            status,
            visible,
            req.file.filename,
            req.params.id
        ];

    } else {

        sql = `
            UPDATE medicines
            SET
                name=?,
                company=?,
                category=?,
                description=?,
                price=?,
                stock=?,
                status=?,
                visible=?
            WHERE id=?
        `;

        values = [
            name,
            company,
            category,
            description,
            price,
            stock,
            status,
            visible,
            req.params.id
        ];

    }

    db.query(sql, values, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json({
            success: true,
            message: "Medicine Updated Successfully"
        });

    });

};

// ======================================
// Toggle Medicine Visibility
// ======================================

exports.toggleVisibility = (req, res) => {

    const medicineId = req.params.id;

    const checkSql = `
        SELECT visible
        FROM medicines
        WHERE id = ?
    `;

    db.query(checkSql, [medicineId], (err, result) => {

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
                message: "Medicine Not Found"
            });

        }

        const newVisibility = result[0].visible ? 0 : 1;

        const updateSql = `
            UPDATE medicines
            SET visible = ?
            WHERE id = ?
        `;

        db.query(updateSql, [newVisibility, medicineId], (updateErr) => {

            if (updateErr) {

                console.log(updateErr);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            return res.json({
                success: true,
                message: "Visibility Updated Successfully",
                visible: newVisibility
            });

        });

    });

};


// ======================================
// Delete Medicine
// ======================================

exports.deleteMedicine = (req, res) => {

    const medicineId = req.params.id;

    const sql = `
        DELETE FROM medicines
        WHERE id = ?
    `;

    db.query(sql, [medicineId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Medicine Not Found"
            });

        }

        return res.json({
            success: true,
            message: "Medicine Deleted Successfully"
        });

    });

};