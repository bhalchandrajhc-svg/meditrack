import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import MainLayout from "../../layouts/MainLayout";
import { vendorMenu } from "../../utils/menu";

import StatCard from "../../components/Dashboard/StatCard";
import StockAlert from "../../components/StockAlert/StockAlert";
import Notifications from "../../components/Notifications/Notifications";

import { getDashboard } from "../../services/vendorDashboardService";
import { useNotification } from "../../context/NotificationContext";
import socket from "../../services/socket";

import {
    Pill,
    Package,
    AlertTriangle,
    XCircle
} from "lucide-react";

import "./Dashboard.css";

function VendorDashboard() {

    const { t } = useTranslation();

    const vendor = JSON.parse(localStorage.getItem("vendor"));

    const { refreshKey } = useNotification();

    const [dashboard, setDashboard] = useState({

        totalMedicines: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStock: 0,
        recentOrders: [],
        stockAlerts: []

    });

    // =============================
    // Load Dashboard
    // =============================

    const loadDashboard = useCallback(async () => {

        try {
            const storedVendor = JSON.parse(localStorage.getItem("vendor"));
            const vendorId = storedVendor?.id || vendor?.id;

            if (!vendorId) return;

            const res = await getDashboard(vendorId);

            setDashboard(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }, [vendor?.id]);

    // =============================
    // Initial Load + Context Refresh
    // =============================

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard, refreshKey]);

    // =============================
    // Socket Events
    // =============================

    useEffect(() => {

        socket.on("dashboardRefresh", loadDashboard);

        socket.on("orderCreated", loadDashboard);

        socket.on("orderStatusUpdated", loadDashboard);

        socket.on("inventoryRefresh", loadDashboard);

        socket.on("medicineUpdated", loadDashboard);

        return () => {

            socket.off("dashboardRefresh", loadDashboard);

            socket.off("orderCreated", loadDashboard);

            socket.off("orderStatusUpdated", loadDashboard);

            socket.off("inventoryRefresh", loadDashboard);

            socket.off("medicineUpdated", loadDashboard);

        };

    }, [loadDashboard]);

    return (

        <MainLayout
            menuItems={vendorMenu(t)}
            title="Medi Track"
            logo="/logo.png"
        >

            <div className="dashboard-grid">

                <StatCard
                    title={t("totalMedicines")}
                    value={dashboard.totalMedicines}
                    subtitle={t("medicineInventory")}
                    color="#2563EB"
                    icon={<Pill size={28} />}
                />

                <StatCard
                    title={t("totalOrders")}
                    value={dashboard.totalOrders}
                    subtitle={t("customerOrders")}
                    color="#10B981"
                    icon={<Package size={28} />}
                />

                <StatCard
                    title={t("pendingOrders")}
                    value={dashboard.pendingOrders}
                    subtitle={t("waitingApproval")}
                    color="#F59E0B"
                    icon={<AlertTriangle size={28} />}
                />

                <StatCard
                    title={t("lowStock")}
                    value={dashboard.lowStock}
                    subtitle={t("needRefill")}
                    color="#EF4444"
                    icon={<XCircle size={28} />}
                />

            </div>

            <div className="dashboard-content">

                <div className="dashboard-left">

                    <div className="recent-orders-card">

                        <h3>{t("recentOrders")}</h3>

                        <table className="recent-table">

                            <thead>

                                <tr>

                                    <th>{t("id")}</th>
                                    <th>{t("customer")}</th>
                                    <th>{t("medicine")}</th>
                                    <th>{t("status")}</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    dashboard.recentOrders.length === 0 ?

                                        <tr>

                                            <td colSpan="4">

                                                {t("noOrdersFound")}

                                            </td>

                                        </tr>

                                        :

                                        dashboard.recentOrders.map((order) => (

                                            <tr key={order.id}>

                                                <td>#{order.id}</td>

                                                <td>{order.customer_name}</td>

                                                <td>{order.medicine_name}</td>

                                                <td>
                                                    <span className={`status-pill status-${(order.status || "Pending").toLowerCase()}`}>
                                                        {t(order.status) || order.status}
                                                    </span>
                                                </td>

                                            </tr>

                                        ))

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="dashboard-right">

                    <StockAlert vendorId={vendor?.id} />

                    <Notifications />

                </div>

            </div>

        </MainLayout>

    );

}

export default VendorDashboard;