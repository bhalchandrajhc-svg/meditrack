import "./NotificationTable.css";

import NotificationCard from "./NotificationCard";
import NotificationEmpty from "./NotificationEmpty";

function NotificationTable({ notifications }) {

    if (notifications.length === 0) {

        return <NotificationEmpty />;

    }

    return (

        <div className="notification-table">

            {notifications.map((notification) => (

                <NotificationCard
                    key={notification.id}
                    notification={notification}
                />

            ))}

        </div>

    );

}

export default NotificationTable;