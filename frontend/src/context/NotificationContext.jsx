import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    getNotifications,
    getCustomerNotifications,
    markAsRead,
    deleteNotification,
    createNotification
} from "../api/notificationApi";

import socket from "../services/socket";

import i18n from "../i18n/i18n";


const NotificationContext = createContext();


export function NotificationProvider({ children }) {

    // =========================================
    // Logged Vendor
    // =========================================

    const [vendorId, setVendorId] = useState(() => {

        const vendor = JSON.parse(
            localStorage.getItem("vendor")
        );

        return vendor?.id || 0;

    });


    // =========================================
    // Vendor Notifications
    // =========================================

    const [notifications, setNotifications] =
        useState([]);


    // =========================================
    // Customer Notifications
    // =========================================

    const [customerNotifications, setCustomerNotifications] =
        useState([]);


    // =========================================
    // Global Refresh
    // =========================================

    const [refreshKey, setRefreshKey] =
        useState(0);


    // =========================================
    // Vendor Ref
    // =========================================

    const vendorIdRef = useRef(vendorId);


    useEffect(() => {

        vendorIdRef.current = vendorId;

    }, [vendorId]);


    // =========================================
    // Load Vendor Notifications
    // =========================================

    const loadNotifications = async () => {

        const storedVendor = JSON.parse(
            localStorage.getItem("vendor")
        );

        const currentVendorId =
            vendorIdRef.current ||
            storedVendor?.id;


        if (!currentVendorId) {

            setNotifications([]);

            return;

        }


        try {

            const res =
                await getNotifications(
                    currentVendorId
                );

            setNotifications(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        }

        catch (err) {

            console.error(
                "Vendor Notification Error:",
                err
            );

        }

    };


    // =========================================
    // Load Customer Notifications
    // =========================================

    const loadCustomerNotifications =
        async () => {

            const customer = JSON.parse(
                localStorage.getItem("user")
            );


            if (!customer?.id) {

                setCustomerNotifications([]);

                return;

            }


            try {

                const res =
                    await getCustomerNotifications(
                        customer.id
                    );


                setCustomerNotifications(
                    Array.isArray(res.data)
                        ? res.data
                        : []
                );

            }

            catch (err) {

                console.error(
                    "Customer Notification Error:",
                    err
                );

            }

        };


    // =========================================
    // Initial / Global Load
    // =========================================

    useEffect(() => {

        loadNotifications();

        loadCustomerNotifications();

    }, [vendorId, refreshKey]);


    // =========================================
    // Refresh Whole Application
    // =========================================

    const refreshApp = () => {

        const vendor = JSON.parse(
            localStorage.getItem("vendor")
        );


        if (vendor?.id) {

            setVendorId(vendor.id);

            vendorIdRef.current =
                vendor.id;

        }


        setRefreshKey(
            prev => prev + 1
        );

    };


    // =========================================
    // Socket Events
    // =========================================

    useEffect(() => {

        // -------------------------------------
        // New Order
        // -------------------------------------

        const handleOrderCreated = () => {

            const vendor = JSON.parse(
                localStorage.getItem("vendor")
            );


            if (vendor?.id) {

                toast.info(
                    "🛒 New Order Received!",
                    {
                        autoClose: 4000
                    }
                );

            }


            loadNotifications();

            loadCustomerNotifications();


            setRefreshKey(
                prev => prev + 1
            );

        };


        // -------------------------------------
        // Order Status Updated
        // -------------------------------------

        const handleStatusUpdated = (data) => {

            const customer = JSON.parse(
                localStorage.getItem("user")
            );


            if (customer?.id) {

                toast.info(
                    i18n.t("orderStatusChangedToast", "Order #{{id}} status changed to {{status}}", {
                        id: data?.orderId || "",
                        status: data?.status || "Updated"
                    }),
                    {
                        autoClose: 4000
                    }
                );

            }


            loadNotifications();

            loadCustomerNotifications();


            setRefreshKey(
                prev => prev + 1
            );

        };


        // -------------------------------------
        // Notification Refresh
        // -------------------------------------

        const handleNotificationRefresh = () => {

            loadNotifications();

            loadCustomerNotifications();


            setRefreshKey(
                prev => prev + 1
            );

        };


        // -------------------------------------
        // Inventory Refresh
        // -------------------------------------

        const handleInventoryRefresh = () => {

            loadNotifications();

        };


        socket.on(
            "orderCreated",
            handleOrderCreated
        );

        socket.on(
            "orderStatusUpdated",
            handleStatusUpdated
        );

        socket.on(
            "notificationRefresh",
            handleNotificationRefresh
        );

        socket.on(
            "inventoryRefresh",
            handleInventoryRefresh
        );


        return () => {

            socket.off(
                "orderCreated",
                handleOrderCreated
            );

            socket.off(
                "orderStatusUpdated",
                handleStatusUpdated
            );

            socket.off(
                "notificationRefresh",
                handleNotificationRefresh
            );

            socket.off(
                "inventoryRefresh",
                handleInventoryRefresh
            );

        };

    }, []);


    // =========================================
    // Add Notification
    // =========================================

    const addNotification =
        async (notifData) => {

            try {

                if (notifData) {

                    await createNotification(
                        notifData
                    );

                }


                await loadNotifications();

                await loadCustomerNotifications();


                refreshApp();

            }

            catch (err) {

                console.error(
                    "Add Notification Error:",
                    err
                );

            }

        };


    // =========================================
    // Mark Vendor Notifications Read
    // =========================================

    const markAllRead = async () => {

        try {

            await Promise.all(

                notifications

                    .filter(
                        item =>
                            Number(item.is_read) === 0
                    )

                    .map(
                        item =>
                            markAsRead(item.id)
                    )

            );


            await loadNotifications();

        }

        catch (err) {

            console.error(err);

        }

    };


    // =========================================
    // Mark Customer Notifications Read
    // =========================================

    const markCustomerNotificationsRead =
        async () => {

            try {

                await Promise.all(

                    customerNotifications

                        .filter(
                            item =>
                                Number(item.is_read) === 0
                        )

                        .map(
                            item =>
                                markAsRead(item.id)
                        )

                );


                await loadCustomerNotifications();

            }

            catch (err) {

                console.error(
                    "Customer Mark Read Error:",
                    err
                );

            }

        };


    // =========================================
    // Clear Vendor Notifications
    // =========================================

    const clearAll = async () => {

        try {

            await Promise.all(

                notifications.map(
                    item =>
                        deleteNotification(
                            item.id
                        )
                )

            );


            await loadNotifications();

        }

        catch (err) {

            console.error(err);

        }

    };


    // =========================================
    // Clear Customer Notifications
    // =========================================

    const clearCustomerNotifications =
        async () => {

            try {

                await Promise.all(

                    customerNotifications.map(
                        item =>
                            deleteNotification(
                                item.id
                            )
                    )

                );


                await loadCustomerNotifications();

            }

            catch (err) {

                console.error(
                    "Customer Clear Error:",
                    err
                );

            }

        };


    // =========================================
    // Counts
    // =========================================

    const unreadCount =
        notifications.filter(
            item =>
                Number(item.is_read) === 0
        ).length;


    const customerUnreadCount =
        customerNotifications.filter(
            item =>
                Number(item.is_read) === 0
        ).length;


    // =========================================
    // Provider
    // =========================================

    return (

        <NotificationContext.Provider

            value={{

                // Vendor
                notifications,
                unreadCount,
                loadNotifications,
                markAllRead,
                clearAll,

                // Customer
                customerNotifications,
                customerUnreadCount,
                loadCustomerNotifications,
                markCustomerNotificationsRead,
                clearCustomerNotifications,

                // Global
                addNotification,
                refreshApp,
                refreshKey

            }}

        >

            {children}

        </NotificationContext.Provider>

    );

}


export const useNotification = () =>
    useContext(NotificationContext);