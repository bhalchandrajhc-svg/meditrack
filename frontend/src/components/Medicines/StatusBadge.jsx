import { useTranslation } from "react-i18next";
import "./MedicineTable.css";

function StatusBadge({ status }) {

    const { t } = useTranslation();

    let className = "";

    if (status === "In Stock")
        className = "in-stock";

    else if (status === "Low Stock")
        className = "low-stock";

    else
        className = "out-stock";

    return (

        <span className={`badge ${className}`}>

            {t(status) || status}

        </span>

    );

}

export default StatusBadge;