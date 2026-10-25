import "./RevenuePieChart.css";

import {

    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend

} from "recharts";

function RevenuePieChart({ data }) {

    const chartData = data?.map((item) => ({

        name: item.status,

        value: Number(item.total)

    })) || [];

    const COLORS = [

        "#22C55E", // Completed
        "#F59E0B", // Pending
        "#3B82F6", // Accepted
        "#8B5CF6", // Ready for Pickup
        "#EF4444"  // Cancelled / Rejected

    ];

    return (

        <div className="pie-card">

            <h3>Order Status</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie

                        data={chartData}

                        dataKey="value"

                        nameKey="name"

                        cx="50%"

                        cy="50%"

                        outerRadius={100}

                        label

                    >

                        {

                            chartData.map((entry, index) => (

                                <Cell

                                    key={index}

                                    fill={COLORS[index % COLORS.length]}

                                />

                            ))

                        }

                    </Pie>

                    <Tooltip

                        formatter={(value) => [

                            value,

                            "Orders"

                        ]}

                    />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default RevenuePieChart;