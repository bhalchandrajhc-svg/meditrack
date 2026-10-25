import {
    Bell,
    Package,
    AlertTriangle,
    CheckCircle
} from "lucide-react";

import "./NotificationDropdown.css";

function NotificationDropdown({

    notifications,
    onClose,
    markAllRead,
    clearAll

}) {

    return (

        <div className="notification-dropdown">

            <div className="notification-header">

                <h3>Notifications</h3>

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

            </div>

            <div className="notification-actions">

                <button onClick={markAllRead}>
                    Mark All Read
                </button>

                <button onClick={clearAll}>
                    Clear All
                </button>

            </div>

            <div className="notification-list">

                {notifications.length === 0 ? (

                    <div className="empty-notification">

                        <Bell size={40} />

                        <p>No Notifications</p>

                    </div>

                ) : (

                    notifications.map((item) => (

                        <div

                            key={item.id}

                            className={`notification-item ${item.read ? "" : "unread"}`}

                        >

                            <div className="notification-icon">

                                {

                                    item.type === "order" ?

                                        <Package size={20} />

                                        :

                                        item.type === "stock" ?

                                            <AlertTriangle size={20} />

                                            :

                                            <CheckCircle size={20} />

                                }

                            </div>

                            <div className="notification-content">

                                <h4>{item.title}</h4>

                                <p>{item.message}</p>

                                <span>{item.time}</span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default NotificationDropdown;