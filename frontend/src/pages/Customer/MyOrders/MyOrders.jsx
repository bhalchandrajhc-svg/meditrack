import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import { getCustomerOrders } from "../../../services/orderService";
import { useNotification } from "../../../context/NotificationContext";
import socket from "../../../services/socket";
import {
    ShoppingBag,
    Store,
    Calendar,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Loader2,
    Sparkles,
    Pill,
    ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./MyOrders.css";

function MyOrders() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const { refreshKey } = useNotification();

    // ==========================
    // Load Orders
    // ==========================
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                setOrders([]);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const customerId = user?.id || user?.user_id || user?._id;

            if (!customerId) {
                setOrders([]);
                setLoading(false);
                return;
            }

            const response = await getCustomerOrders(customerId);
            let orderList = [];

            if (Array.isArray(response.data)) {
                orderList = response.data;
            } else if (response.data.orders) {
                orderList = response.data.orders;
            } else if (response.data.data) {
                orderList = response.data.data;
            }

            setOrders(orderList);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load & Refresh
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshKey]);

    // Socket Events
    useEffect(() => {
        const handleRefresh = () => fetchOrders();

        socket.on("customerOrdersRefresh", handleRefresh);
        socket.on("orderCreated", handleRefresh);
        socket.on("orderStatusUpdated", handleRefresh);
        socket.on("dashboardRefresh", handleRefresh);

        return () => {
            socket.off("customerOrdersRefresh", handleRefresh);
            socket.off("orderCreated", handleRefresh);
            socket.off("orderStatusUpdated", handleRefresh);
            socket.off("dashboardRefresh", handleRefresh);
        };
    }, [fetchOrders]);

    // Format Date
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Status Badges Map
    const renderStatusBadge = (status = "Pending") => {
        const normalized = status.toLowerCase();
        if (normalized === "accepted") {
            return (
                <span className="order-status-badge accepted">
                    <CheckCircle size={14} /> {t("accepted", "Accepted")}
                </span>
            );
        }
        if (normalized === "ready") {
            return (
                <span className="order-status-badge ready">
                    <Package size={14} /> {t("readyPickup", "Ready for Pickup")}
                </span>
            );
        }
        if (normalized === "completed") {
            return (
                <span className="order-status-badge completed">
                    <CheckCircle size={14} /> {t("completed", "Completed")}
                </span>
            );
        }
        if (normalized === "rejected") {
            return (
                <span className="order-status-badge rejected">
                    <XCircle size={14} /> {t("cancelled", "Cancelled")}
                </span>
            );
        }
        return (
            <span className="order-status-badge pending">
                <Clock size={14} /> {t("pending", "Pending")}
            </span>
        );
    };

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                (order.medicine_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (order.shop_name || "").toLowerCase().includes(search.toLowerCase());

            const normalizedStatus = (order.status || "Pending").toLowerCase();
            const matchesStatus =
                statusFilter === "All" || normalizedStatus === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const statuses = ["All", "Pending", "Accepted", "Ready", "Completed", "Rejected"];

    const statusLabels = {
        All: t("all", "All"),
        Pending: t("pending", "Pending"),
        Accepted: t("accepted", "Accepted"),
        Ready: t("readyStatus", "Ready"),
        Completed: t("completed", "Completed"),
        Rejected: t("cancelled", "Cancelled")
    };

    return (
        <CustomerLayout>
            <div className="my-orders-page">
                {/* Hero Banner Header */}
                <div className="orders-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <ShoppingBag size={14} />
                            <span>{t("liveReservations", "Live Medicine Reservations")}</span>
                        </div>
                        <h2>{t("myOrdersTitle", "My Orders & Reservations")}</h2>
                        <p>
                            {t("myOrdersDesc", "Track real-time status of your reserved medicines across local pharmacies. View pickup details and order history.")}
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="orders-controls-card">
                    <div className="orders-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder={t("searchOrders", "Search orders by medicine or pharmacy name...")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="status-tabs-container">
                        <Filter size={15} className="filter-icon" />
                        <div className="status-tabs">
                            {statuses.map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    className={`tab-btn ${statusFilter.toLowerCase() === st.toLowerCase() ? "active" : ""}`}
                                    onClick={() => setStatusFilter(st)}
                                >
                                    {statusLabels[st] || st}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="results-status-bar">
                    <div className="status-info">
                        <Sparkles size={16} className="sparkle-icon" />
                        <span className="results-count">
                            {t("showing", "Showing")} <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? t("order_single", "order") : t("orders_plural", "orders")}
                            {orders.length > 0 && ` ${t("outOf", "out of")} ${orders.length}`}
                        </span>
                    </div>
                </div>

                {/* Orders List */}
                <div className="orders-container">
                    {loading ? (
                        <div className="orders-loading-state">
                            <Loader2 size={36} className="loading-spinner" />
                            <p>{t("loadingOrders", "Loading your orders...")}</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <div className="orders-grid">
                            {filteredOrders.map((order) => (
                                <div className="order-card-item" key={order.id}>
                                    <div className="order-card-image-box">
                                        <img
                                            src={
                                                order.image
                                                    ? `http://localhost:5000/uploads/medicines/${order.image}`
                                                    : "https://placehold.co/200x200/e2e8f0/1e293b?text=Medicine"
                                            }
                                            alt={order.medicine_name || "Medicine"}
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/200x200/e2e8f0/1e293b?text=Medicine";
                                            }}
                                        />
                                    </div>

                                    <div className="order-card-details">
                                        <div className="order-title-row">
                                            <h3 className="medicine-name">
                                                {order.medicine_name || "Medicine"}
                                            </h3>
                                            {renderStatusBadge(order.status)}
                                        </div>

                                        <div className="order-meta-info">
                                            <div className="meta-item">
                                                <Store size={15} className="meta-icon" />
                                                <span>{t("pharmacy", "Pharmacy")}: <strong>{order.shop_name || t("localPharmacy", "Local Pharmacy")}</strong></span>
                                            </div>

                                            <div className="meta-item">
                                                <Calendar size={15} className="meta-icon" />
                                                <span>{t("date", "Date")}: <strong>{formatDate(order.order_date || order.createdAt)}</strong></span>
                                            </div>

                                            <div className="meta-item">
                                                <Pill size={15} className="meta-icon" />
                                                <span>{t("quantity", "Quantity")}: <strong>{order.quantity || 1}</strong></span>
                                            </div>
                                        </div>

                                        <div className="order-footer-row">
                                            <div className="order-total-price">
                                                <span className="price-label">{t("total", "Total")}:</span>
                                                <span className="price-value">₹{order.total_amount || 0}</span>
                                            </div>

                                            <button
                                                type="button"
                                                className="view-order-btn"
                                                onClick={() => navigate(`/customer/medicines`)}
                                            >
                                                <span>{t("browseMore", "Browse More")}</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="orders-empty-state">
                            <ShoppingBag size={44} className="empty-icon" />
                            <h3>{t("noOrdersTitle", "No Orders Found")}</h3>
                            <p>
                                {search || statusFilter !== "All"
                                    ? t("noOrdersFiltered", "No orders matched your current search or status filter.")
                                    : t("noOrdersYet", "You haven't reserved any medicines yet. Search medicines near you to place an order.")}
                            </p>
                            <button
                                type="button"
                                className="browse-medicines-btn"
                                onClick={() => navigate("/customer/medicines")}
                            >
                                {t("browseMedicines", "Browse Medicines")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}

export default MyOrders;