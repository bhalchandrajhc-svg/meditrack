import { BellOff } from "lucide-react";
import { useCustomerNotification } from "../../../context/CustomerNotificationContext";
import { useTranslation } from "react-i18next";
import "./EmptyNotifications.css";

function EmptyNotifications() {

    const { t } = useTranslation();

    const { loadNotifications, filter } = useCustomerNotification();

    const messages = {
        All:     t("emptyAll", "You're all caught up! New notifications will appear here."),
        Unread:  t("emptyUnread", "No unread notifications. You're all caught up!"),
        Orders:  t("emptyOrders", "No order notifications yet. Place an order to see updates here."),
        Updates: t("emptyUpdates", "No status updates yet.")
    };

    return (

        <div className="empty-notifications">

            <div className="empty-notifications__icon-wrap">
                <BellOff size={70} strokeWidth={1.4} />
            </div>

            <h2>{t("noNotificationsTitle", "No Notifications")}</h2>

            <p>{messages[filter] || messages.All}</p>

            <button onClick={loadNotifications}>
                🔄 {t("refresh", "Refresh")}
            </button>

        </div>

    );

}

export default EmptyNotifications;