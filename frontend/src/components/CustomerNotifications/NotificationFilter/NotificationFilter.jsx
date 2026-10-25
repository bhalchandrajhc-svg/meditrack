import { useCustomerNotification } from "../../../context/CustomerNotificationContext";
import { useTranslation } from "react-i18next";
import "./NotificationFilter.css";

const FILTERS = [
    { labelKey: "all",           key: "All"     },
    { labelKey: "unreadFilter",  key: "Unread"  },
    { labelKey: "ordersFilter",  key: "Orders"  },
    { labelKey: "updatesFilter", key: "Updates" }
];

function NotificationFilter() {

    const { t } = useTranslation();

    const { filter, setFilter, unreadCount } = useCustomerNotification();

    return (

        <div className="notification-filter">

            {FILTERS.map(({ labelKey, key }) => (

                <button
                    key={key}
                    className={filter === key ? "active" : ""}
                    onClick={() => setFilter(key)}
                >
                    {t(labelKey, key)}
                    {key === "Unread" && unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount}</span>
                    )}
                </button>

            ))}

        </div>

    );

}

export default NotificationFilter;