import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Bell, Building2, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { adminMenu } from "../../utils/adminMenu";
import socket from "../../services/socket";
import "./Admin.css";

const API_URL = "http://localhost:5000/api/admin";

function AdminNotifications() {
    const navigate = useNavigate();
    const token = localStorage.getItem("admin_token");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        if (!token) return navigate("/weblogin");
        try {
            const response = await axios.get(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(response.data);
        } catch (error) {
            if ([401, 403].includes(error.response?.status)) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin");
                navigate("/weblogin");
            }
        } finally { setLoading(false); }
    }, [navigate, token]);

    useEffect(() => { loadNotifications(); }, [loadNotifications]);
    useEffect(() => {
        socket.on("adminNotificationRefresh", loadNotifications);
        return () => socket.off("adminNotificationRefresh", loadNotifications);
    }, [loadNotifications]);

    const logout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin");
        navigate("/weblogin");
    };

    return <MainLayout menuItems={adminMenu} title="Medi Track" subtitle="Admin Panel" showNavbar={false}>
        <div className="admin-page-heading"><div><h2>Notifications</h2><p>New vendor registration requests requiring your action.</p></div><button className="admin-logout" onClick={logout}><LogOut size={18} /> Logout</button></div>
        <section className="admin-notifications-card">
            {loading ? <p className="admin-empty">Loading notifications...</p> : notifications.length === 0 ? <div className="admin-notification-empty"><Bell size={36} /><h3>No new notifications</h3><p>All vendor registration requests have been reviewed.</p></div> : notifications.map((notification) => <article className="admin-notification-item" key={notification.id}>
                <span className="admin-notification-icon"><Building2 size={22} /></span>
                <div className="admin-notification-body"><h3>{notification.title}</h3><p>{notification.message}</p><small>{notification.vendor.email}{notification.vendor.mobile ? ` · ${notification.vendor.mobile}` : ""}</small></div>
                <button onClick={() => navigate("/admin/vendor-info", { state: { vendorId: notification.id } })}>View vendor <ChevronRight size={17} /></button>
            </article>)}
        </section>
    </MainLayout>;
}

export default AdminNotifications;
