import { useTranslation } from "react-i18next";
import "./ReportTable.css";

function ReportTable({ reports }) {

    const { t } = useTranslation();

    return (

        <div className="report-table">

            <table>

                <thead>

                    <tr>

                        <th>{t("Order ID")}</th>

                        <th>{t("date")}</th>

                        <th>{t("customer")}</th>

                        <th>{t("medicine")}</th>

                        <th>{t("quantity")}</th>

                        <th>{t("total")}</th>

                        <th>{t("status")}</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        reports?.length > 0 ? (

                            reports.map((report) => (

                                <tr key={report.id}>

                                    <td>#{report.id}</td>

                                    <td>
                                        {
                                            report.order_date
                                                ? new Date(report.order_date).toLocaleDateString()
                                                : "-"
                                        }
                                    </td>

                                    <td>
                                        <strong>{report.customer}</strong>
                                    </td>

                                    <td>
                                        {report.medicine}
                                    </td>

                                    <td>
                                        {report.quantity}
                                    </td>

                                    <td>
                                        ₹ {Number(report.total_amount || 0).toFixed(2)}
                                    </td>

                                    <td>

                                        <span
                                            className={`status ${report.status
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >

                                            {t(report.status) || report.status}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="empty-row"
                                >

                                    {t("noOrdersFound")}

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ReportTable;