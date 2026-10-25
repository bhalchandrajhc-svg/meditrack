const db = require("../config/db");
const sendEmail = require("../utils/sendEmail");

// ============================
// Get All Orders
// ============================

exports.getOrders = (req, res) => {

    const sql = `
        SELECT
            orders.*,
            medicines.name AS medicine_name,
            users.username AS customer_name,
            vendors.shop_name
        FROM orders

        INNER JOIN medicines
            ON medicines.id = orders.medicine_id

        INNER JOIN users
            ON users.id = orders.customer_id

        INNER JOIN vendors
            ON vendors.id = orders.vendor_id

        ORDER BY orders.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

// ============================
// Get Single Order
// ============================

exports.getOrder = (req, res) => {

    const sql = `
        SELECT *
        FROM orders
        WHERE id=?
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json(result[0]);

    });

};

// ============================
// Add Order
// ============================

exports.addOrder = (req, res) => {

    const {

        vendor_id,
        customer_id,
        medicine_id,
        quantity,
        total_amount

    } = req.body;

    const sql = `
        INSERT INTO orders
        (
            vendor_id,
            customer_id,
            medicine_id,
            quantity,
            total_amount
        )
        VALUES (?,?,?,?,?)
    `;

    db.query(

        sql,

        [
            vendor_id,
            customer_id,
            medicine_id,
            quantity,
            total_amount
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            // Retrieve customer details and send email
            db.query(`SELECT username, email FROM users WHERE id = ?`, [customer_id], (uErr, uResult) => {
                if (!uErr && uResult.length > 0) {
                    const customerEmail = uResult[0].email;
                    const customerName = uResult[0].username;
                    sendEmail(
                        customerEmail,
                        `Medi Track - Order Placed Successfully #${result.insertId}`,
                        `Hi ${customerName},\n\nYour order #${result.insertId} has been successfully placed.\n\nDetails:\nQuantity: ${quantity}\nTotal Amount: Rs. ${total_amount}\n\nThank you!`
                    ).catch(mailErr => console.error("Error sending order placed email:", mailErr));
                }
            });

            res.json({

                success: true,
                message: "Order Created Successfully",
                orderId: result.insertId

            });

        }

    );

};

// ============================
// Update Order Status
// ============================

exports.updateStatus = (req, res) => {
    const io = req.app.get("io");
    const sql = `
        UPDATE orders
        SET status=?
        WHERE id=?
    `;

    db.query(

        sql,

        [

            req.body.status,
            req.params.id

        ],

        (err) => {

            if (err) {

                return res.status(500).json(err);

            }

            // ============================
            // Auto Notification - Status Update
            // ============================
            const status = req.body.status;
            const statusEmojis = { Accepted: "✅", Rejected: "❌", Ready: "📦", Completed: "🏆" };
            const emoji = statusEmojis[status] || "🔔";

            // Customer notification messages per status
            const customerTitles = {
                Accepted: `Order Accepted ✅`,
                Rejected: `Order Cancelled ❌`,
                Ready:    `Ready to Pick 📦`,
                Completed:`Order Completed 🏆`
            };
            const customerMessages = {
                Accepted: `Your order #${req.params.id} has been accepted by the pharmacy! Please come for pickup.`,
                Rejected: `Sorry, your order #${req.params.id} was cancelled by the pharmacy.`,
                Ready:    `Your medicine for order #${req.params.id} is ready for pickup!`,
                Completed:`Your order #${req.params.id} has been completed. Thank you!`
            };

            // Fetch vendor_id and customer_id for this order
            db.query(`SELECT vendor_id, customer_id FROM orders WHERE id = ?`, [req.params.id], (oErr, oResult) => {
                if (!oErr && oResult.length > 0) {
                    const vId = oResult[0].vendor_id;
                    const cId = oResult[0].customer_id;

                    // Vendor notification
                    db.query(
                        `INSERT INTO notifications (vendor_id, customer_id, title, message, type) VALUES (?, NULL, ?, ?, ?)`,
                        [vId, `Order Status Updated ${emoji}`, `Order #${req.params.id} status changed to "${status}".`, "status"],
                        (nErr) => { if (nErr) console.log("Vendor Notification Error:", nErr); }
                    );

                    // Customer notification and email
                    if (cId) {
                        db.query(`SELECT username, email FROM users WHERE id = ?`, [cId], (uErr, uResult) => {
                            if (!uErr && uResult.length > 0) {
                                const customerEmail = uResult[0].email;
                                const customerName = uResult[0].username;

                                // Send email notification for status changes
                                if (status === "Completed" || status === "Ready" || status === "Rejected") {
                                    let emailSubject = "";
                                    let emailBody = "";

                                    if (status === "Ready") {
                                        emailSubject = `Your Order #${req.params.id} is Ready to Pick Up! 📦`;
                                        emailBody = `Hi ${customerName},\n\nGood news! Your medicine for order #${req.params.id} is ready for pickup.\n\nPlease visit the pharmacy to collect your medicines.\n\nThank you for using Medi Track!`;
                                    } else if (status === "Completed") {
                                        emailSubject = `Your Order #${req.params.id} has been Completed! 🏆`;
                                        emailBody = `Hi ${customerName},\n\nYour order #${req.params.id} has been completed and collected.\n\nThank you for choosing Medi Track!`;
                                    } else if (status === "Rejected") {
                                        emailSubject = `Your Order #${req.params.id} has been Cancelled ❌`;
                                        emailBody = `Hi ${customerName},\n\nWe regret to inform you that your order #${req.params.id} was cancelled by the pharmacy.\n\nPlease contact the pharmacy or try ordering again.\n\nThank you.`;
                                    }

                                    if (emailSubject) {
                                        sendEmail(customerEmail, emailSubject, emailBody).catch(mailErr =>
                                            console.error("Error sending order status email:", mailErr)
                                        );
                                    }
                                }
                            }
                        });

                        if (customerTitles[status]) {
                            db.query(
                                `INSERT INTO notifications (vendor_id, customer_id, title, message, type) VALUES (NULL, ?, ?, ?, ?)`,
                                [cId, customerTitles[status], customerMessages[status], "order"],
                                (cnErr) => { if (cnErr) console.log("Customer Notification Error:", cnErr); }
                            );
                        }
                    }
                }
            });

            io.emit("orderStatusUpdated", {

                orderId: req.params.id,

                status: req.body.status

            });

            io.emit("dashboardRefresh");

            io.emit("customerOrdersRefresh");

            io.emit("notificationRefresh");

            io.emit("customerNotificationRefresh");

            res.json({

                success: true,
                message: "Order Status Updated"

            });

        }

    );

};

// ============================
// Delete Order
// ============================

exports.deleteOrder = (req, res) => {

    const sql = `
        DELETE FROM orders
        WHERE id=?
    `;

    db.query(sql, [req.params.id], (err) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json({

            success: true,
            message: "Order Deleted Successfully"

        });

    });

};

// ============================
// Customer Reserve Medicine
// ============================

exports.reserveMedicine = (req, res) => {
    const io = req.app.get("io");
    const {
        customer_id,
        medicine_id,
        quantity
    } = req.body;

    if (!customer_id || !medicine_id || !quantity) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    const medicineSql = `
        SELECT
            id,
            vendor_id,
            price,
            stock
        FROM medicines
        WHERE id = ?
    `;

    db.query(medicineSql, [medicine_id], (err, medicineResult) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        if (medicineResult.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });

        }

        const medicine = medicineResult[0];

        if (medicine.stock < quantity) {

            return res.status(400).json({
                success: false,
                message: "Insufficient Stock"
            });

        }

        const total = medicine.price * quantity;

        const insertOrder = `
            INSERT INTO orders
            (
                vendor_id,
                customer_id,
                medicine_id,
                quantity,
                total_amount
            )
            VALUES (?,?,?,?,?)
        `;

        db.query(

            insertOrder,

            [
                medicine.vendor_id,
                customer_id,
                medicine_id,
                quantity,
                total
            ],

            (err2, orderResult) => {

                if (err2) {

                    console.log(err2);

                    return res.status(500).json(err2);

                }

                const orderId = orderResult.insertId;

                const insertItem = `
                    INSERT INTO order_items
                    (
                        order_id,
                        medicine_id,
                        quantity,
                        unit_price,
                        subtotal
                    )
                    VALUES (?,?,?,?,?)
                `;

                db.query(

                    insertItem,

                    [
                        orderId,
                        medicine_id,
                        quantity,
                        medicine.price,
                        total
                    ],

                    (err3) => {

                        if (err3) {

                            console.log(err3);

                            return res.status(500).json(err3);

                        }

                        db.query(

                            `
                            UPDATE medicines
                            SET stock = stock - ?
                            WHERE id = ?
                            `,

                            [
                                quantity,
                                medicine_id
                            ],

                            (err4) => {

                                if (err4) {

                                    console.log(err4);

                                    return res.status(500).json(err4);

                                }
                                // ============================
                                // Auto Notification - New Order (Vendor)
                                // ============================
                                db.query(
                                    `INSERT INTO notifications (vendor_id, customer_id, title, message, type) VALUES (?, NULL, ?, ?, ?)`,
                                    [
                                        medicine.vendor_id,
                                        "New Order Received 🛒",
                                        `A new medicine reservation has been placed. Medicine ID: ${medicine_id}, Quantity: ${quantity}.`,
                                        "order"
                                    ],
                                    (nErr) => { if (nErr) console.log("Vendor Notification Error:", nErr); }
                                );

                                // ============================
                                // Auto Notification - New Order (Customer)
                                // ============================
                                db.query(
                                    `INSERT INTO notifications (vendor_id, customer_id, title, message, type) VALUES (NULL, ?, ?, ?, ?)`,
                                    [
                                        customer_id,
                                        "Order Placed Successfully 🛒",
                                        `Your medicine reservation (Order #${orderId}) has been placed. Quantity: ${quantity}. Waiting for pharmacy confirmation.`,
                                        "order"
                                    ],
                                    (cnErr) => { if (cnErr) console.log("Customer Notification Error:", cnErr); }
                                );

                                // Send email notification to customer
                                db.query(`SELECT username, email FROM users WHERE id = ?`, [customer_id], (uErr, uResult) => {
                                    if (!uErr && uResult.length > 0) {
                                        const customerEmail = uResult[0].email;
                                        const customerName = uResult[0].username;
                                        sendEmail(
                                            customerEmail,
                                            `Medi Track - Order Placed Successfully #${orderId}`,
                                            `Hi ${customerName},\n\nYour order #${orderId} has been successfully placed.\n\nDetails:\nQuantity: ${quantity}\nTotal Amount: Rs. ${total}\n\nWaiting for pharmacy confirmation.\n\nThank you!`
                                        ).catch(mailErr => console.error("Error sending order placed email:", mailErr));
                                    }
                                });

                                io.emit("orderCreated", {

                                    orderId,

                                    vendorId: medicine.vendor_id,

                                    customerId: customer_id,

                                    medicineId: medicine_id

                                });

                                io.emit("dashboardRefresh");

                                io.emit("inventoryRefresh");

                                io.emit("notificationRefresh");

                                io.emit("customerNotificationRefresh");

                                io.emit("customerOrdersRefresh");
                                res.json({

                                    success: true,
                                    message: "Medicine Reserved Successfully",
                                    order_id: orderId

                                });

                            }

                        );

                    }

                );

            }

        );

    });

};


// ============================
// Customer Orders
// ============================

exports.getCustomerOrders = (req, res) => {

    const customerId = req.params.customerId;

    const sql = `
        SELECT

            o.id,
            o.quantity,
            o.total_amount,
            o.status,
            o.order_date,

            m.name AS medicine_name,
            m.image,

            v.shop_name

        FROM orders o

        INNER JOIN medicines m
            ON o.medicine_id = m.id

        INNER JOIN vendors v
            ON o.vendor_id = v.id

        WHERE o.customer_id = ?

        ORDER BY o.id DESC
    `;

    db.query(sql, [customerId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

};


// ============================
// Vendor Orders
// ============================

exports.getVendorOrders = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            o.*,

            u.username AS customer_name,
            u.username,

            u.email,

            m.name AS medicine_name,
            m.image

        FROM orders o

        INNER JOIN users u
            ON o.customer_id = u.id

        INNER JOIN medicines m
            ON o.medicine_id = m.id

        WHERE o.vendor_id = ?

        ORDER BY o.order_date DESC
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

};