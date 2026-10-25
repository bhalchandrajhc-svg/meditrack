const db = require("../config/db");

// ======================================
// Inventory Dashboard
// ======================================

exports.getInventoryDashboard = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            COUNT(*) AS totalMedicines,
            IFNULL(SUM(stock),0) AS totalStock,
            SUM(
                CASE
                    WHEN stock <= 10 AND stock > 0
                    THEN 1
                    ELSE 0
                END
            ) AS lowStock,
            SUM(
                CASE
                    WHEN stock = 0
                    THEN 1
                    ELSE 0
                END
            ) AS outOfStock,
            IFNULL(SUM(price * stock),0) AS inventoryValue
        FROM medicines
        WHERE vendor_id = ?
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result[0]);

    });

};


// ======================================
// Inventory Medicines
// ======================================

exports.getInventory = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            id,
            name,
            company,
            category,
            price,
            stock,
            image,
            updated_at,

            CASE
                WHEN stock = 0 THEN 'Out Of Stock'
                WHEN stock <= 10 THEN 'Low Stock'
                ELSE 'In Stock'
            END AS status

        FROM medicines

        WHERE vendor_id = ?

        ORDER BY name ASC
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
// Category Wise Stock
// ======================================

exports.getCategoryStock = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            category,
            SUM(stock) AS stock
        FROM medicines
        WHERE vendor_id = ?
        GROUP BY category
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
// Stock Overview
// ======================================

exports.getStockOverview = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            SUM(
                CASE
                    WHEN stock > 10
                    THEN 1
                    ELSE 0
                END
            ) AS inStock,

            SUM(
                CASE
                    WHEN stock <= 10
                    AND stock > 0
                    THEN 1
                    ELSE 0
                END
            ) AS lowStock,

            SUM(
                CASE
                    WHEN stock = 0
                    THEN 1
                    ELSE 0
                END
            ) AS outStock

        FROM medicines

        WHERE vendor_id = ?
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result[0]);

    });

};


// ======================================
// Stock History
// ======================================

exports.getStockHistory = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            sh.*,

            m.name AS medicine_name

        FROM stock_history sh

        INNER JOIN medicines m
            ON m.id = sh.medicine_id

        WHERE m.vendor_id = ?

        ORDER BY sh.created_at DESC
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
// Update Medicine Stock
// ======================================

exports.updateMedicineStock = (req, res) => {

    const {
        medicineId,
        type,
        quantity,
        reason
    } = req.body;

    const getMedicineSql = `
        SELECT *
        FROM medicines
        WHERE id = ?
    `;

    db.query(getMedicineSql, [medicineId], (err, result) => {

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

        const medicine = result[0];

        let newStock = medicine.stock;

        if (type === "add") {

            newStock += Number(quantity);

        } else if (type === "remove") {

            newStock -= Number(quantity);

        }

        if (newStock < 0) {

            return res.status(400).json({
                success: false,
                message: "Stock Cannot Be Negative"
            });

        }

        const updateSql = `
            UPDATE medicines
            SET
                stock = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        db.query(updateSql, [newStock, medicineId], (updateErr) => {

            if (updateErr) {

                console.log(updateErr);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            const historySql = `
                INSERT INTO stock_history
                (
                    medicine_id,
                    type,
                    quantity,
                    reason,
                    created_at
                )
                VALUES
                (
                    ?, ?, ?, ?, NOW()
                )
            `;

            db.query(

                historySql,

                [
                    medicineId,
                    type,
                    quantity,
                    reason
                ],

                (historyErr) => {

                    if (historyErr) {

                        console.log(historyErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed To Save Stock History"
                        });

                    }

                    return res.json({

                        success: true,
                        message: "Stock Updated Successfully",
                        stock: newStock

                    });

                }

            );

        });

    });

};