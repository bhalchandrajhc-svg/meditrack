import { Bell } from "lucide-react";
import "./NotificationBell.css";

function NotificationBell({
    count,
    onClick,
}) {

    return (

        <div
            className="notification-bell"
            onClick={onClick}
        >

            <Bell size={22} />

            {count > 0 && (

                <span className="notification-count">

                    {count}

                </span>

            )}

        </div>

    );

}

export default NotificationBell;