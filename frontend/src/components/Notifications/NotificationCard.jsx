import "./NotificationCard.css";

import {
    Bell,
    CheckCircle,
    AlertTriangle,
    Trash2
} from "lucide-react";

function NotificationCard({ notification }) {

    return (

        <div
            className={`notification-card ${
                notification.read ? "read" : "unread"
            }`}
        >

            <div className="notification-icon">

                <Bell size={22} />

            </div>

            <div className="notification-content">

                <h4>{notification.title}</h4>

                <p>{notification.message}</p>

                <small>{notification.time}</small>

            </div>

            <div className="notification-actions">

                {!notification.read && (

                    <CheckCircle
                        size={20}
                        className="action-icon"
                    />

                )}

                <Trash2
                    size={20}
                    className="action-icon delete"
                />

            </div>

        </div>

    );

}

export default NotificationCard;