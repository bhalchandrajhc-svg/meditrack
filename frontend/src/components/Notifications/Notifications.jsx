import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";

import {
    getNotifications,
    deleteNotification,
    markAsRead
} from "../../api/notificationApi";

import "./Notifications.css";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        try {

            // Temporary Vendor ID = 1
            const res = await getNotifications(1);

            setNotifications(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleRead = async (id) => {

        try {

            await markAsRead(id);

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        try {

            await deleteNotification(id);

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="notifications">

            <h3>Notifications</h3>

            {notifications.length === 0 ? (

                <div className="notification-empty">

                    No Notifications

                </div>

            ) : (

                notifications.map((item) => (

                    <div
                        className={`notification-item ${item.is_read ? "read" : ""}`}
                        key={item.id}
                    >

                        <div
                            className="notification-content"
                            onClick={() => handleRead(item.id)}
                        >

                            <Bell size={18} />

                            <div>

                                <strong>{item.title}</strong>

                                <p>{item.message}</p>

                            </div>

                        </div>

                        <Trash2
                            size={18}
                            className="delete-icon"
                            onClick={() => handleDelete(item.id)}
                        />

                    </div>

                ))

            )}

        </div>

    );

}

export default Notifications;