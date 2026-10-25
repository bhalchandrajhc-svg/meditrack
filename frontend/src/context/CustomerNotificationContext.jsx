import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    getCustomerNotifications,
    markAsRead,
    deleteNotification
} from "../api/notificationApi";

import socket from "../services/socket";

import i18n from "../i18n/i18n";

const CustomerNotificationContext = createContext();

export function CustomerNotificationProvider({ children }) {

    const [customerId, setCustomerId] = useState(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.id || null;
    });

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("All");
    const [refreshKey, setRefreshKey] = useState(0);

    // Ref so socket handlers always have latest customerId
    const customerIdRef = useRef(customerId);
    useEffect(() => {
        customerIdRef.current = customerId;
    }, [customerId]);

    // ==========================
    // Load Notifications
    // ==========================

    const loadNotifications = useCallback(async () => {
        const cId = customerIdRef.current
            || JSON.parse(localStorage.getItem("user"))?.id;

        if (!cId) return;

        try {
            const res = await getCustomerNotifications(cId);
            setNotifications(res.data);
        } catch (err) {
            console.log("Customer notifications load error:", err);
        }
    }, []);

    useEffect(() => {
        // Sync customerId from localStorage when it changes
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id) {
            setCustomerId(user.id);
            customerIdRef.current = user.id;
        }
        loadNotifications();
    }, [refreshKey, loadNotifications]);

    // ==========================
    // Socket: Real-time Toasts
    // ==========================

    useEffect(() => {

        const handleOrderCreated = (data) => {
            const cId = customerIdRef.current;
            // Only show toast to the customer who placed the order
            if (!data?.customerId || String(data.customerId) === String(cId)) {
                toast.success(i18n.t("orderPlacedToast", "🛒 Your order has been placed successfully!"), {
                    autoClose: 5000,
                    position: "top-right"
                });
            }
            loadNotifications();
            setRefreshKey(prev => prev + 1);
        };

        const handleStatusUpdated = (data) => {
            const status = data?.status;
            const orderId = data?.orderId || "";

            const toastMap = {
                Accepted: () => toast.success(i18n.t("orderAcceptedToast", "✅ Order #{{id}} Accepted! Your pharmacy has accepted your order.", { id: orderId }), { autoClose: 5000 }),
                Rejected: () => toast.error(i18n.t("orderRejectedToast", "❌ Order #{{id}} Cancelled. Sorry, your order was rejected.", { id: orderId }), { autoClose: 6000 }),
                Ready:    () => toast.info(i18n.t("orderReadyToast", "📦 Order #{{id}} Ready! Your medicine is ready for pickup!", { id: orderId }), { autoClose: 6000 }),
                Completed:() => toast.success(i18n.t("orderCompletedToast", "🏆 Order #{{id}} Completed! Thank you for using Medi Track.", { id: orderId }), { autoClose: 5000 })
            };

            if (toastMap[status]) toastMap[status]();

            loadNotifications();
            setRefreshKey(prev => prev + 1);
        };

        const handleNotificationRefresh = () => {
            loadNotifications();
            setRefreshKey(prev => prev + 1);
        };

        socket.on("orderCreated", handleOrderCreated);
        socket.on("orderStatusUpdated", handleStatusUpdated);
        socket.on("notificationRefresh", handleNotificationRefresh);
        socket.on("customerNotificationRefresh", handleNotificationRefresh);

        return () => {
            socket.off("orderCreated", handleOrderCreated);
            socket.off("orderStatusUpdated", handleStatusUpdated);
            socket.off("notificationRefresh", handleNotificationRefresh);
            socket.off("customerNotificationRefresh", handleNotificationRefresh);
        };

    }, [loadNotifications]);

    // ==========================
    // Mark Single as Read
    // ==========================

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
            );
        } catch (err) {
            console.log(err);
        }
    };

    // ==========================
    // Delete Single
    // ==========================

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    // ==========================
    // Mark All Read
    // ==========================

    const markAllRead = async () => {
        try {
            const unread = notifications.filter(n => n.is_read === 0);
            await Promise.all(unread.map(n => markAsRead(n.id)));
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (err) {
            console.log(err);
        }
    };

    // ==========================
    // Clear All
    // ==========================

    const clearAll = async () => {
        try {
            await Promise.all(notifications.map(n => deleteNotification(n.id)));
            setNotifications([]);
        } catch (err) {
            console.log(err);
        }
    };

    // ==========================
    // Filtered Notifications
    // ==========================

    const filteredNotifications = notifications.filter(n => {
        if (filter === "All")    return true;
        if (filter === "Unread") return n.is_read === 0;
        if (filter === "Orders") return n.type === "order";
        if (filter === "Updates") return n.type === "status";
        return true;
    });

    const unreadCount = notifications.filter(n => n.is_read === 0).length;

    return (
        <CustomerNotificationContext.Provider
            value={{
                notifications,
                filteredNotifications,
                unreadCount,
                filter,
                setFilter,
                loadNotifications,
                markAsRead: handleMarkAsRead,
                deleteNotification: handleDelete,
                markAllRead,
                clearAll,
                refreshKey
            }}
        >
            {children}
        </CustomerNotificationContext.Provider>
    );

}

export const useCustomerNotification = () => useContext(CustomerNotificationContext);
