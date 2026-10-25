import "./InventoryAnalytics.css";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

function InventoryAnalytics({ medicines }) {

    const total = medicines.length;

    const inStock = medicines.filter(
        (item) => item.stock > 10
    ).length;

    const lowStock = medicines.filter(
        (item) =>
            item.stock > 0 &&
            item.stock <= 10
    ).length;

    const outOfStock = medicines.filter(
        (item) => item.stock === 0
    ).length;

    const stockData = [
        {
            name: "In Stock",
            value: inStock,
            color: "#22c55e",
        },
        {
            name: "Low Stock",
            value: lowStock,
            color: "#f59e0b",
        },
        {
            name: "Out Of Stock",
            value: outOfStock,
            color: "#ef4444",
        },
    ];

    const barData = [
        {
            status: "In Stock",
            value: inStock,
        },
        {
            status: "Low",
            value: lowStock,
        },
        {
            status: "Out",
            value: outOfStock,
        },
    ];

    const categories = [...new Set(medicines.map((m) => m.category))];

    const categoryData = categories.map((category) => {

        const items = medicines.filter(
            (m) => m.category === category
        );

        return {

            category,

            stock: items.reduce(
                (sum, item) => sum + item.stock,
                0
            ),

        };

    });

    const inventoryValue = medicines.reduce(
        (sum, item) =>
            sum +
            Number(item.price.replace("₹", "")) *
                item.stock,
        0
    );

    return (

        <div className="inventory-analytics">

            {/* Donut */}

            <div className="analytics-card">

                <h4>Stock Distribution</h4>

                <ResponsiveContainer
                    width="100%"
                    height={260}
                >

                    <PieChart>

                        <Pie
                            data={stockData}
                            dataKey="value"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                        >

                            {stockData.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={entry.color}
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            {/* Bar */}

            <div className="analytics-card">

                <h4>Stock Overview</h4>

                <ResponsiveContainer
                    width="100%"
                    height={260}
                >

                    <BarChart data={barData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="status" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="value"
                            fill="#2563eb"
                            radius={[6,6,0,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Category */}

            <div className="analytics-card">

                <h4>Category Wise Stock</h4>

                <ResponsiveContainer
                    width="100%"
                    height={260}
                >

                    <BarChart
                        layout="vertical"
                        data={categoryData}
                    >

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis type="number"/>

                        <YAxis
                            dataKey="category"
                            type="category"
                        />

                        <Tooltip/>

                        <Bar
                            dataKey="stock"
                            fill="#14b8a6"
                            radius={[0,6,6,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Value */}

            <div className="analytics-card value-card">

                <h4>Inventory Value</h4>

                <div className="value-circle">

                    ₹ {inventoryValue.toLocaleString()}

                </div>

                <p>Total Inventory Value</p>

                <span>{total} Medicines</span>

            </div>

        </div>

    );

}

export default InventoryAnalytics;