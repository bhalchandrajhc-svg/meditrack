import "./TopMedicineChart.css";

import {

    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip

} from "recharts";

function TopMedicineChart({ data }) {

    const chartData = data?.map((item) => ({

        medicine: item.name,

        sales: Number(item.totalSold)

    })) || [];

    return (

        <div className="top-chart-card">

            <h3>Top Selling Medicines</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 5
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="medicine"
                    />

                    <YAxis />

                    <Tooltip
                        formatter={(value) => [
                            value,
                            "Sold"
                        ]}
                    />

                    <Bar
                        dataKey="sales"
                        fill="#10B981"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default TopMedicineChart;