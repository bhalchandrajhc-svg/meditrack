import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, Clock3, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { adminMenu } from "../../utils/adminMenu";
import StatCard from "../../components/Dashboard/StatCard";
import "../Vendor/Dashboard.css";
import "./Admin.css";

const API_URL = "http://localhost:5000/api/admin";

function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState({ totalVendors: 0, totalCustomers: 0, pendingVendors: 0, vendors: [] });
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const token = localStorage.getItem("admin_token");
    const requestConfig = { headers: { Authorization: `Bearer ${token}` } };

    const loadDashboard = useCallback(async () => {
        if (!token) return navigate("/weblogin");
        try {
            const response = await axios.get(`${API_URL}/dashboard`, requestConfig);
            setDashboard(response.data);
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin");
                navigate("/weblogin");
            }
        } finally { setLoading(false); }
    }, [navigate, token]);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    const changeStatus = async (vendorId, status) => {
        setUpdatingId(vendorId);
        try { await axios.put(`${API_URL}/vendors/${vendorId}/status`, { status }, requestConfig); await loadDashboard(); }
        catch (err) { alert(err.response?.data?.message || "Could not update vendor status"); }
        finally { setUpdatingId(null); }
    };

    const logout = () => { localStorage.removeItem("admin_token"); localStorage.removeItem("admin"); navigate("/weblogin"); };

    return <MainLayout menuItems={adminMenu} title="Medi Track" subtitle="Admin Panel" showNavbar={false}>
        <div className="admin-page-heading"><div><h2>Admin Dashboard</h2><p>Review pharmacy registration requests.</p></div><button className="admin-logout" onClick={logout}><LogOut size={18} /> Logout</button></div>
        <section className="dashboard-grid admin-dashboard-grid">
            <StatCard title="Total Vendors" value={dashboard.totalVendors} subtitle="Registered pharmacies" color="#2563EB" icon={<Building2 size={30} />} />
            <StatCard title="Total Customers" value={dashboard.totalCustomers} subtitle="Registered users" color="#10B981" icon={<Users size={30} />} />
            <StatCard title="Pending Requests" value={dashboard.pendingVendors} subtitle="Waiting for review" color="#F59E0B" icon={<Clock3 size={30} />} />
        </section>
        <section className="recent-orders-card admin-vendors-card"><div className="admin-section-title"><div><h3>Vendor Registrations</h3><p>Accept or reject new pharmacy accounts.</p></div><ShieldCheck size={25} /></div>
            {loading ? <p className="admin-empty">Loading vendor registrations...</p> : <div className="admin-table-wrap"><table className="recent-table"><thead><tr><th>Pharmacy</th><th>Owner</th><th>Contact</th><th>Location</th><th>Status</th><th>Action</th></tr></thead><tbody>
                {dashboard.vendors.length === 0 ? <tr><td colSpan="6" className="admin-empty">No vendor registrations found.</td></tr> : dashboard.vendors.map((vendor) => <tr key={vendor.id}>
                    <td><b>{vendor.shop_name}</b><small>{vendor.email}</small></td><td>{vendor.owner_name}</td><td>{vendor.mobile || "—"}</td><td>{[vendor.city, vendor.state].filter(Boolean).join(", ") || "—"}</td><td><span className={`admin-status ${vendor.status?.toLowerCase()}`}>{vendor.status}</span></td>
                    <td>{vendor.status === "Pending" ? <div className="admin-actions"><button disabled={updatingId === vendor.id} className="approve" onClick={() => changeStatus(vendor.id, "Approved")}>Accept</button><button disabled={updatingId === vendor.id} className="reject" onClick={() => changeStatus(vendor.id, "Rejected")}>Reject</button></div> : "—"}</td>
                </tr>)}
            </tbody></table></div>}
        </section>
    </MainLayout>;
}

export default AdminDashboard;
