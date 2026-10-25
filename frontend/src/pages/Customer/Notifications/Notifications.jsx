import { useEffect } from "react";
import { CheckCheck, Trash2, Bell } from "lucide-react";

import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import NotificationFilter from "../../../components/CustomerNotifications/NotificationFilter/NotificationFilter";
import EmptyNotifications from "../../../components/CustomerNotifications/EmptyNotifications/EmptyNotifications";
import NotificationCard from "../../../components/CustomerNotifications/NotificationCard/NotificationCard";

import { useCustomerNotification } from "../../../context/CustomerNotificationContext";
import socket from "../../../services/socket";
import { useTranslation } from "react-i18next";

import "./Notifications.css";

function Notifications() {

    const { t } = useTranslation();

    const {
        filteredNotifications,
        unreadCount,
        loadNotifications,
        markAllRead,
        clearAll
    } = useCustomerNotification();

    // Refresh on socket events
    useEffect(() => {

        socket.on("notificationRefresh", loadNotifications);
        socket.on("customerNotificationRefresh", loadNotifications);
        socket.on("orderCreated", loadNotifications);
        socket.on("orderStatusUpdated", loadNotifications);

        return () => {
            socket.off("notificationRefresh", loadNotifications);
            socket.off("customerNotificationRefresh", loadNotifications);
            socket.off("orderCreated", loadNotifications);
            socket.off("orderStatusUpdated", loadNotifications);
        };

    }, [loadNotifications]);

    return (

        <CustomerLayout>

            <div className="notifications-page">

                {/* Header */}
                <div className="notifications-header">

                    <div className="notifications-header__left">

                        <div className="notifications-header__icon">
                            <Bell size={26} />
                            {unreadCount > 0 && (
                                <span className="notifications-header__badge">{unreadCount}</span>
                            )}
                        </div>

                        <div>
                            <h2>{t("notificationsTitle", "Notifications")}</h2>
                            <p>{t("stayUpdated", "Stay updated with your medicine reservations and pharmacy alerts.")}</p>
                        </div>

                    </div>

                    <div className="notifications-header__actions">

                        {unreadCount > 0 && (
                            <button
                                className="notif-action-btn notif-action-btn--read"
                                onClick={markAllRead}
                                title={t("markAllAsRead", "Mark all as read")}
                            >
                                <CheckCheck size={16} />
                                {t("markAllRead", "Mark All Read")}
                            </button>
                        )}

                        <button
                            className="notif-action-btn notif-action-btn--clear"
                            onClick={clearAll}
                            title={t("clearAllNotifications", "Clear all notifications")}
                        >
                            <Trash2 size={16} />
                            {t("clearAll", "Clear All")}
                        </button>

                    </div>

                </div>

                {/* Filter Tabs */}
                <NotificationFilter />

                {/* Notification List or Empty State */}
                {filteredNotifications.length > 0 ? (

                    <div className="notifications-list">
                        {filteredNotifications.map(notification => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </div>

                ) : (

                    <EmptyNotifications />

                )}

            </div>

        </CustomerLayout>

    );

}

export default Notifications;