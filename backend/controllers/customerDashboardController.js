const db = require("../config/db");

// ======================================
// Customer Dashboard Summary
// ======================================

exports.getDashboardSummary = (req, res) => {

    const customerId = req.params.customerId;

    db.query(

        `
        SELECT
            COUNT(*) AS totalReservations
        FROM orders
        WHERE customer_id = ?
        `,

        [customerId],

        (err, total) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            db.query(

                `
                SELECT
                    COUNT(*) AS pendingReservations
                FROM orders
                WHERE customer_id = ?
                AND status = 'Pending'
                `,

                [customerId],

                (err, pending) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "Database Error"
                        });

                    }

                    db.query(

                        `
                        SELECT
                            COUNT(*) AS completedReservations
                        FROM orders
                        WHERE customer_id = ?
                        AND status = 'Completed'
                        `,

                        [customerId],

                        (err, completed) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Database Error"
                                });

                            }

                            db.query(

                                `
                                SELECT
                                    COUNT(*) AS nearbyPharmacies
                                FROM vendors
                                WHERE status = 'Approved'
                                `,

                                (err, vendors) => {

                                    if (err) {

                                        console.log(err);

                                        return res.status(500).json({
                                            success: false,
                                            message: "Database Error"
                                        });

                                    }

                                    return res.json({

                                        totalReservations:
                                            total[0].totalReservations,

                                        pendingReservations:
                                            pending[0].pendingReservations,

                                        completedReservations:
                                            completed[0].completedReservations,

                                        nearbyPharmacies:
                                            vendors[0].nearbyPharmacies

                                    });

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};