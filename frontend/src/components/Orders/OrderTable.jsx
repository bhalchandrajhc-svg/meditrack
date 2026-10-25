import { useTranslation } from "react-i18next";
import "./OrderTable.css";
import OrderStatusBadge from "./OrderStatusBadge";

import {
    Eye,
    CheckCircle,
    XCircle,
    PackageCheck,
    BadgeCheck,
    Trash2,
} from "lucide-react";

function OrderTable({
    orders = [],
    onView,
    onAccept,
    onReject,
    onReady,
    onComplete,
    onDelete,
}) {

    const { t } = useTranslation();

    return (

        <div className="order-table">

            <table>

                <thead>

                    <tr>

                        <th>{t("Order ID")}</th>
                        <th>{t("customer")}</th>
                        <th>{t("medicine")}</th>
                        <th>{t("quantity")}</th>
                        <th>{t("total")}</th>
                        <th>{t("date")}</th>
                        <th>{t("status")}</th>
                        <th>{t("Actions")}</th>

                    </tr>

                </thead>

                <tbody>

                    {orders.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                style={{
                                    textAlign: "center",
                                    padding: "30px",
                                }}
                            >
                                {t("noOrdersFound")}
                            </td>

                        </tr>

                    ) : (

                        orders.map((order) => (

                            <tr key={order.id}>

                                <td>#{order.id}</td>

                                <td><strong>{order.customer_name}</strong></td>

                                <td>{order.medicine_name}</td>

                                <td>{order.quantity}</td>

                                <td>₹{order.total_amount}</td>

                                <td>
                                    {new Date(order.order_date).toLocaleDateString()}
                                </td>

                                <td>

                                    <OrderStatusBadge
                                        status={order.status}
                                    />

                                </td>

                                <td>

                                    <div className="order-actions">

                                        <Eye
                                            size={18}
                                            className="view"
                                            onClick={() => onView(order)}
                                            title={t("view")}
                                        />

                                        <CheckCircle
                                            size={18}
                                            className="accept"
                                            onClick={() => onAccept(order.id)}
                                            title={t("accepted")}
                                        />

                                        <XCircle
                                            size={18}
                                            className="reject"
                                            onClick={() => onReject(order.id)}
                                            title={t("cancelled")}
                                        />

                                        <PackageCheck
                                            size={18}
                                            className="pickup"
                                            onClick={() => onReady(order.id)}
                                            title={t("readyPickup")}
                                        />

                                        <BadgeCheck
                                            size={18}
                                            className="complete"
                                            onClick={() => onComplete(order.id)}
                                            title={t("completed")}
                                        />

                                        <Trash2
                                            size={18}
                                            className="delete"
                                            onClick={() => onDelete(order.id)}
                                            title={t("delete")}
                                        />

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default OrderTable;