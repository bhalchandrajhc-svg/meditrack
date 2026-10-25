const db = require("../config/db");

// ======================================
// Dashboard Summary
// ======================================

exports.getReportDashboard = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            COUNT(*) AS totalOrders,
            IFNULL(SUM(total_amount),0) AS totalRevenue,
            IFNULL(SUM(quantity),0) AS medicinesSold,
            SUM(
                CASE
                    WHEN status='Completed'
                    THEN 1
                    ELSE 0
                END
            ) AS completedOrders
        FROM orders
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
// Monthly Revenue
// ======================================

exports.getMonthlyRevenue = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            MONTHNAME(order_date) AS month,
            SUM(total_amount) AS revenue
        FROM orders
        WHERE vendor_id = ?
        GROUP BY
            YEAR(order_date),
            MONTH(order_date)
        ORDER BY
            YEAR(order_date),
            MONTH(order_date)
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
// Order Status Report
// ======================================

exports.getOrderStatus = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            status,
            COUNT(*) AS total
        FROM orders
        WHERE vendor_id = ?
        GROUP BY status
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
// Top Selling Medicines
// ======================================

exports.getTopMedicines = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            m.name,
            SUM(o.quantity) AS totalSold
        FROM orders o
        INNER JOIN medicines m
            ON o.medicine_id = m.id
        WHERE o.vendor_id = ?
        GROUP BY o.medicine_id
        ORDER BY totalSold DESC
        LIMIT 5
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
// Orders Report
// ======================================

exports.getReportOrders = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT
            o.id,
            DATE_FORMAT(o.order_date,'%Y-%m-%d') AS order_date,
            u.username AS customer,
            m.name AS medicine,
            o.quantity,
            o.total_amount,
            o.status
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

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result);

    });

};

// ======================================
// AI Smart Store Analytics & Insights
// ======================================

exports.getAiInsights = (req, res) => {

    const vendorId = req.params.vendorId;

    // 1. High Selling Medicines query
    const highSellingSql = `
        SELECT
            m.id,
            m.name,
            m.category,
            m.price,
            m.stock,
            SUM(o.quantity) AS totalSold,
            SUM(o.total_amount) AS totalRevenue,
            COUNT(o.id) AS orderCount
        FROM orders o
        INNER JOIN medicines m ON o.medicine_id = m.id
        WHERE o.vendor_id = ? AND (o.status IS NULL OR o.status != 'Rejected')
        GROUP BY m.id, m.name, m.category, m.price, m.stock
        ORDER BY totalSold DESC
        LIMIT 6
    `;

    // 2. All medicines with sales to determine low/slow selling items
    const allMedicinesSql = `
        SELECT
            m.id,
            m.name,
            m.category,
            m.price,
            m.stock,
            IFNULL(SUM(CASE WHEN o.status != 'Rejected' THEN o.quantity ELSE 0 END), 0) AS totalSold,
            IFNULL(SUM(CASE WHEN o.status != 'Rejected' THEN o.total_amount ELSE 0 END), 0) AS totalRevenue
        FROM medicines m
        LEFT JOIN orders o ON o.medicine_id = m.id
        WHERE m.vendor_id = ?
        GROUP BY m.id, m.name, m.category, m.price, m.stock
        ORDER BY totalSold ASC, m.stock DESC
    `;

    db.query(highSellingSql, [vendorId], (err, highResult) => {

        if (err) {
            console.log("AI High Selling Query Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        db.query(allMedicinesSql, [vendorId], (err2, allResult) => {

            if (err2) {
                console.log("AI All Medicines Query Error:", err2);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            const highSelling = (highResult || []).map((item) => ({
                id: item.id,
                name: item.name,
                category: item.category || "General",
                price: Number(item.price),
                stock: Number(item.stock),
                totalSold: Number(item.totalSold),
                totalRevenue: Number(item.totalRevenue),
                orderCount: Number(item.orderCount),
                demandLevel: Number(item.totalSold) > 10 ? "🔥 Super High" : "⚡ High Demand",
                profitImpact: "High Profitability"
            }));

            // Filter low selling: items with totalSold <= 2
            const lowSelling = (allResult || [])
                .filter((item) => Number(item.totalSold) <= 2)
                .slice(0, 6)
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category || "General",
                    price: Number(item.price),
                    stock: Number(item.stock),
                    totalSold: Number(item.totalSold),
                    status: Number(item.totalSold) === 0 ? "Zero Sales" : "Slow Moving",
                    recommendation: Number(item.stock) > 20
                        ? "Reduce stock orders & offer 10% discount bundle"
                        : "Monitor customer demand or replace with high-demand alternative"
                }));

            // Reorder alerts for high demand items with stock <= 15
            const reorderAlerts = (highResult || [])
                .filter((item) => Number(item.stock) <= 15)
                .map((item) => ({
                    name: item.name,
                    stock: Number(item.stock),
                    totalSold: Number(item.totalSold),
                    action: "Re-stock immediately (+50 units suggested for max profit)"
                }));

            // Recommended product categories to stock for higher profit
            const categorySales = {};
            (highResult || []).forEach(item => {
                const cat = item.category || "General";
                categorySales[cat] = (categorySales[cat] || 0) + Number(item.totalSold);
            });

            // General AI Recommendations
            const recommendedProducts = [
                {
                    name: "Paracetamol 650mg / Dolo 650",
                    category: "Fever & Pain Relief",
                    demandScore: "98/100",
                    estimatedProfitMargin: "35% - 40%",
                    reason: "High seasonal demand & daily quick-turnaround fast seller."
                },
                {
                    name: "Multivitamin & Zinc Capsules (Limcee / Becosules)",
                    category: "Supplements & Wellness",
                    demandScore: "94/100",
                    estimatedProfitMargin: "30% - 45%",
                    reason: "High repeat customer purchase frequency & high profit margin."
                },
                {
                    name: "Pain Relief Spray & Gel (Volini / Moov)",
                    category: "Topical Pain Care",
                    demandScore: "91/100",
                    estimatedProfitMargin: "25% - 35%",
                    reason: "Top impulse buy item with excellent store profit margins."
                },
                {
                    name: "Antacid Syrup & Omez Capsules",
                    category: "Gastro Health",
                    demandScore: "89/100",
                    estimatedProfitMargin: "28% - 38%",
                    reason: "Steady year-round prescription & over-the-counter demand."
                },
                {
                    name: "Cough Syrup & Throat Lozenges",
                    category: "Respiratory & Cold",
                    demandScore: "87/100",
                    estimatedProfitMargin: "30% - 40%",
                    reason: "Essential seasonal stocking recommendation to prevent stockouts."
                }
            ];

            const totalStoreSales = highSelling.reduce((acc, curr) => acc + curr.totalSold, 0);
            const totalStoreRev = highSelling.reduce((acc, curr) => acc + curr.totalRevenue, 0);

            const aiInsights = {
                summary: {
                    totalTopSold: totalStoreSales,
                    topRevenue: totalStoreRev,
                    healthScore: totalStoreSales > 15 ? "Excellent (95/100)" : "Good (80/100)",
                    profitGrowthPotential: "+22% Estimated Revenue Boost with AI Stocking"
                },
                highSelling,
                lowSelling,
                reorderAlerts,
                recommendedProducts
            };

            return res.json({
                success: true,
                aiInsights
            });

        });

    });

};