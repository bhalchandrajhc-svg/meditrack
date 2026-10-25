import "./SalesChart.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function SalesChart({ reports }) {

    const monthlyData = reports?.map((item) => ({

        month: item.month,

        sales: Number(item.revenue)

    })) || [];

    return (

        <div className="sales-chart-card">

            <h3>Monthly Revenue</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart
                    data={monthlyData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 5
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="month"
                    />

                    <YAxis />

                    <Tooltip
                        formatter={(value) => [
                            `₹ ${Number(value).toFixed(2)}`,
                            "Revenue"
                        ]}
                    />

                    <Bar
                        dataKey="sales"
                        fill="#2563EB"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default SalesChart;