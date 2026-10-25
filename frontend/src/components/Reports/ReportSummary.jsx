import { useTranslation } from "react-i18next";
import "./ReportSummary.css";

function ReportSummary({ dashboard }) {

    const { t } = useTranslation();

    return (

        <div className="report-summary">

            <div className="summary-card">

                <span className="summary-title">
                    {t("totalOrders")}
                </span>

                <h2 className="summary-value">
                    {dashboard?.totalOrders ?? 0}
                </h2>

            </div>

            <div className="summary-card">

                <span className="summary-title">
                    {t("totalRevenue") || "Total Revenue"}
                </span>

                <h2 className="summary-value">
                    ₹ {Number(dashboard?.totalRevenue || 0).toFixed(2)}
                </h2>

            </div>

            <div className="summary-card">

                <span className="summary-title">
                    {t("medicinesSold") || "Medicines Sold"}
                </span>

                <h2 className="summary-value">
                    {dashboard?.medicinesSold ?? 0}
                </h2>

            </div>

            <div className="summary-card">

                <span className="summary-title">
                    {t("completedOrders") || "Completed Orders"}
                </span>

                <h2 className="summary-value">
                    {dashboard?.completedOrders ?? 0}
                </h2>

            </div>

        </div>

    );

}

export default ReportSummary;