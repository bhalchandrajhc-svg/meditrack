import { useTranslation } from "react-i18next";
import "./InventorySummary.css";

import {
    Package,
    AlertTriangle,
    XCircle,
    TrendingUp
} from "lucide-react";

function InventorySummary({ medicines }) {

    const { t } = useTranslation();

    const totalStock = medicines.reduce(
        (sum, medicine) => sum + medicine.stock,
        0
    );

    const lowStock = medicines.filter(
        (medicine) =>
            medicine.stock > 0 &&
            medicine.stock <= 10
    ).length;

    const outOfStock = medicines.filter(
        (medicine) => medicine.stock === 0
    ).length;

    const totalMedicines = medicines.length;

    const cards = [

        {
            title: t("totalMedicines"),
            value: totalMedicines,
            icon: <Package size={26} />,
            color: "#2563eb",
        },

        {
            title: t("totalStock"),
            value: totalStock,
            icon: <TrendingUp size={26} />,
            color: "#16a34a",
        },

        {
            title: t("lowStock"),
            value: lowStock,
            icon: <AlertTriangle size={26} />,
            color: "#f59e0b",
        },

        {
            title: t("outOfStock"),
            value: outOfStock,
            icon: <XCircle size={26} />,
            color: "#ef4444",
        },

    ];

    return (

        <div className="inventory-summary">

            {cards.map((card, index) => (

                <div
                    className="summary-card"
                    key={index}
                >

                    <div
                        className="summary-icon"
                        style={{
                            background: card.color,
                        }}
                    >
                        {card.icon}
                    </div>

                    <div>

                        <h5>{card.title}</h5>

                        <h2>{card.value}</h2>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default InventorySummary;