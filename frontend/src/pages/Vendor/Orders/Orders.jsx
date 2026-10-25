import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import {
    getVendorOrders,
    updateOrderStatus,
    deleteOrder as deleteOrderApi
} from "../../../api/orderApi";

import { createNotification } from "../../../api/notificationApi";

import { useNotification } from "../../../context/NotificationContext";
import socket from "../../../services/socket";

import OrderSearchFilter from "../../../components/Orders/OrderSearchFilter";
import OrderTable from "../../../components/Orders/OrderTable";
import ViewOrderModal from "../../../components/Orders/ViewOrderModal";

import "./Orders.css";


function Orders() {

    const { t } = useTranslation();

    const vendor = JSON.parse(
        localStorage.getItem("vendor")
    );

    const {
        loadNotifications,
        refreshKey,
        refreshApp
    } = useNotification();


    // ==========================
    // States
    // ==========================

    const [search, setSearch] = useState("");

    const [status, setStatus] =
        useState("All Status");

    const [orders, setOrders] =
        useState([]);

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [isViewOpen, setIsViewOpen] =
        useState(false);


    // ==========================
    // Load Orders
    // ==========================

    const loadOrders = useCallback(async () => {

        const storedVendor = JSON.parse(
            localStorage.getItem("vendor")
        );

        const vendorId =
            storedVendor?.id ||
            vendor?.id;

        if (!vendorId) {
            return;
        }

        try {

            const res =
                await getVendorOrders(
                    vendorId
                );

            setOrders(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        }

        catch (err) {

            console.error(
                "Load Orders Error:",
                err
            );

            toast.error(
                t("failed_load_orders")
            );

        }

    }, [vendor?.id, t]);


    // ==========================
    // Initial Load
    // ==========================

    useEffect(() => {

        if (!vendor) {

            toast.error(
                "Vendor not logged in"
            );

            return;

        }

        loadOrders();

    }, [loadOrders, refreshKey]);


    // ==========================
    // Socket Events
    // ==========================

    useEffect(() => {

        socket.on(
            "orderCreated",
            loadOrders
        );

        socket.on(
            "orderStatusUpdated",
            loadOrders
        );

        socket.on(
            "dashboardRefresh",
            loadOrders
        );

        socket.on(
            "notificationRefresh",
            loadOrders
        );


        return () => {

            socket.off(
                "orderCreated",
                loadOrders
            );

            socket.off(
                "orderStatusUpdated",
                loadOrders
            );

            socket.off(
                "dashboardRefresh",
                loadOrders
            );

            socket.off(
                "notificationRefresh",
                loadOrders
            );

        };

    }, [loadOrders]);


    // ==========================
    // View Order
    // ==========================

    const viewOrder = (order) => {

        setSelectedOrder(order);

        setIsViewOpen(true);

    };


    // ==========================
    // Find Order
    // ==========================

    const findOrder = (id) => {

        return orders.find(
            order =>
                Number(order.id) ===
                Number(id)
        );

    };


    // ==========================
    // Common Order Action
    // ==========================

    const handleOrderAction = async (

        id,
        orderStatus,
        title,
        message,
        type,
        toastMethod

    ) => {

        try {

            // Find current order
            const currentOrder =
                findOrder(id);


            if (!currentOrder) {

                toast.error(
                    "Order information not found"
                );

                return;

            }


            // Update order status
            await updateOrderStatus(
                id,
                orderStatus
            );


            // ==========================
            // CUSTOMER NOTIFICATION
            // ==========================

            await createNotification({

                customer_id:
                    currentOrder.customer_id,

                vendor_id: null,

                title,

                message,

                type

            });


            // ==========================
            // Refresh Vendor Notification
            // ==========================

            await loadNotifications();


            // ==========================
            // Refresh Application
            // ==========================

            refreshApp();


            // ==========================
            // Toast
            // ==========================

            toast[toastMethod](
                message
            );


            // ==========================
            // Reload Orders
            // ==========================

            await loadOrders();

        }

        catch (err) {

            console.error(
                "Order Action Error:",
                err
            );

            toast.error(
                t("unable_update_order")
            );

        }

    };


    // ==========================
    // Accept Order
    // ==========================

    const acceptOrder = (id) => {

        handleOrderAction(

            id,

            "Accepted",

            "Order Accepted",

            `Your Order #${id} has been accepted by the pharmacy.`,

            "success",

            "success"

        );

    };


    // ==========================
    // Reject Order
    // ==========================

    const rejectOrder = (id) => {

        handleOrderAction(

            id,

            "Rejected",

            "Order Rejected",

            `Your Order #${id} has been rejected by the pharmacy.`,

            "danger",

            "error"

        );

    };


    // ==========================
    // Ready For Pickup
    // ==========================

    const readyOrder = (id) => {

        handleOrderAction(

            id,

            "Ready for Pickup",

            "Ready For Pickup",

            `Your Order #${id} is ready for pickup.`,

            "info",

            "info"

        );

    };


    // ==========================
    // Complete Order
    // ==========================

    const completeOrder = (id) => {

        handleOrderAction(

            id,

            "Completed",

            "Order Completed",

            `Your Order #${id} has been completed successfully.`,

            "success",

            "success"

        );

    };


    // ==========================
    // Delete Order
    // ==========================

    const deleteOrder = async (id) => {

        const confirmDelete =
            window.confirm(
                t("delete_order_confirm")
            );

        if (!confirmDelete) {
            return;
        }


        try {

            const currentOrder =
                findOrder(id);


            // Create customer notification
            // BEFORE deleting the order

            if (currentOrder?.customer_id) {

                await createNotification({

                    customer_id:
                        currentOrder.customer_id,

                    vendor_id: null,

                    title:
                        "Order Cancelled",

                    message:
                        `Your Order #${id} has been cancelled by the pharmacy.`,

                    type:
                        "danger"

                });

            }


            // Delete order

            await deleteOrderApi(id);


            // Refresh

            await loadNotifications();

            refreshApp();


            toast.success(
                t("order_deleted")
            );


            await loadOrders();

        }

        catch (err) {

            console.error(
                "Delete Order Error:",
                err
            );

            toast.error(
                t("delete_failed")
            );

        }

    };


    // ==========================
    // Search Filter
    // ==========================

    const filteredOrders =
        orders.filter((order) => {

            const keyword =
                search.toLowerCase();


            const matchSearch =

                (order.customer_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (order.username || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (order.medicine_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(order.id)
                    .includes(search);


            const matchStatus =

                status === "All Status"

                ||

                order.status === status;


            return (
                matchSearch &&
                matchStatus
            );

        });


    // ==========================
    // Render
    // ==========================

    return (

        <MainLayout

            menuItems={vendorMenu(t)}

            title="Medi Track"

            logo="/logo.png"

        >

            <div className="orders-page">


                {/* Header */}

                <div className="page-header">

                    <div>

                        <h2>
                            {t("orders")}
                        </h2>

                        <p>
                            {t("manage_orders")}
                        </p>

                    </div>

                </div>


                {/* Search */}

                <OrderSearchFilter

                    search={search}

                    setSearch={setSearch}

                    status={status}

                    setStatus={setStatus}

                />


                {/* Orders */}

                <OrderTable

                    orders={filteredOrders}

                    onView={viewOrder}

                    onAccept={acceptOrder}

                    onReject={rejectOrder}

                    onReady={readyOrder}

                    onComplete={completeOrder}

                    onDelete={deleteOrder}

                />


                {/* View Modal */}

                <ViewOrderModal

                    isOpen={isViewOpen}

                    onClose={() =>
                        setIsViewOpen(false)
                    }

                    order={selectedOrder}

                />

            </div>

        </MainLayout>

    );

}


export default Orders;