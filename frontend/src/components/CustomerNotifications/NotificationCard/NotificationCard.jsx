import { Trash2, Check } from "lucide-react";
import { useCustomerNotification } from "../../../context/CustomerNotificationContext";
import { useTranslation } from "react-i18next";
import "./NotificationCard.css";

// Icon + color config per type/title
function getNotifStyle(notification) {
    const title = notification.title || "";
    const type  = notification.type  || "";

    if (title.includes("Placed") || title.includes("Received"))
        return { icon: "🛒", bg: "#EFF6FF", border: "#BFDBFE", badge: "#2563EB" };
    if (title.includes("Accepted"))
        return { icon: "✅", bg: "#F0FDF4", border: "#BBF7D0", badge: "#16A34A" };
    if (title.includes("Cancelled") || title.includes("Rejected"))
        return { icon: "❌", bg: "#FFF1F2", border: "#FECDD3", badge: "#DC2626" };
    if (title.includes("Ready") || title.includes("Pick"))
        return { icon: "📦", bg: "#FFFBEB", border: "#FDE68A", badge: "#D97706" };
    if (title.includes("Completed"))
        return { icon: "🏆", bg: "#F5F3FF", border: "#DDD6FE", badge: "#7C3AED" };
    if (type === "status")
        return { icon: "🔔", bg: "#F0F9FF", border: "#BAE6FD", badge: "#0284C7" };

    return { icon: "💊", bg: "#F8FAFC", border: "#E2E8F0", badge: "#64748B" };
}

function timeAgo(dateStr, t) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60)   return t("secondsAgo", "{{count}}s ago", { count: diff });
    if (diff < 3600) return t("minutesAgo", "{{count}}m ago", { count: Math.floor(diff / 60) });
    if (diff < 86400) return t("hoursAgo", "{{count}}h ago", { count: Math.floor(diff / 3600) });
    return t("daysAgo", "{{count}}d ago", { count: Math.floor(diff / 86400) });
}

function NotificationCard({ notification }) {

    const { t } = useTranslation();

    const { markAsRead, deleteNotification } = useCustomerNotification();

    const style = getNotifStyle(notification);
    const isUnread = notification.is_read === 0;

    const handleClick = () => {
        if (isUnread) markAsRead(notification.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNotification(notification.id);
    };

    return (

        <div
            className={`notif-card ${isUnread ? "notif-card--unread" : ""}`}
            style={{ background: style.bg, borderLeft: `4px solid ${style.border}` }}
            onClick={handleClick}
        >

            {/* Unread dot */}
            {isUnread && (
                <span className="notif-card__dot" style={{ background: style.badge }} />
            )}

            {/* Icon */}
            <div className="notif-card__icon" style={{ background: style.border }}>
                <span>{style.icon}</span>
            </div>

            {/* Content */}
            <div className="notif-card__content">
                <div className="notif-card__top">
                    <h4 className="notif-card__title" style={{ color: style.badge }}>
                        {notification.title}
                    </h4>
                    <span className="notif-card__time">
                        {timeAgo(notification.created_at, t)}
                    </span>
                </div>
                <p className="notif-card__message">{notification.message}</p>
                {isUnread && (
                    <span className="notif-card__tag" style={{ background: style.badge }}>
                        {t("newTag", "New")}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="notif-card__actions">
                {isUnread && (
                    <button
                        className="notif-card__btn notif-card__btn--read"
                        title={t("markAsRead", "Mark as read")}
                        onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                    >
                        <Check size={14} />
                    </button>
                )}
                <button
                    className="notif-card__btn notif-card__btn--delete"
                    title={t("delete", "Delete")}
                    onClick={handleDelete}
                >
                    <Trash2 size={14} />
                </button>
            </div>

        </div>

    );

}

export default NotificationCard;
