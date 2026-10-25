import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Building2, FileText, LogOut, MapPin, Phone, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { adminMenu } from "../../utils/adminMenu";
import "./Admin.css";

const API_URL = "http://localhost:5000/api/admin";
const imageUrl = (filename) => filename ? `http://localhost:5000/uploads/shop_photos/${filename}` : null;
const licenseUrl = (filename) => filename ? `http://localhost:5000/uploads/licenses/${filename}` : null;

function VendorInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("admin_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const handleAuthError = (error) => {
        if ([401, 403].includes(error.response?.status)) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin");
            navigate("/weblogin");
            return true;
        }
        return false;
    };

    const loadVendorDetails = useCallback(async (vendorId) => {
        setDetailsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/vendors/${vendorId}`, config);
            setSelectedVendor(response.data);
        } catch (error) { handleAuthError(error); }
        finally { setDetailsLoading(false); }
    }, [token]);

    useEffect(() => {
        if (!token) { navigate("/weblogin"); return; }
        const loadVendors = async () => {
            try {
                const response = await axios.get(`${API_URL}/dashboard`, config);
                setVendors(response.data.vendors || []);
                const requestedVendorId = location.state?.vendorId;
                const selectedId = response.data.vendors?.some((vendor) => vendor.id === requestedVendorId)
                    ? requestedVendorId
                    : response.data.vendors?.[0]?.id;
                if (selectedId) loadVendorDetails(selectedId);
            } catch (error) { handleAuthError(error); }
            finally { setLoading(false); }
        };
        loadVendors();
    }, [token, navigate, loadVendorDetails, location.state]);

    const logout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin");
        navigate("/weblogin");
    };

    return <MainLayout menuItems={adminMenu} title="Medi Track" subtitle="Admin Panel" showNavbar={false}>
        <div className="admin-page-heading"><div><h2>Vendor Information</h2><p>Select a pharmacy to see its complete registration details.</p></div><button className="admin-logout" onClick={logout}><LogOut size={18} /> Logout</button></div>
        <div className="vendor-info-layout">
            <aside className="vendor-list-card"><h3>All Vendors</h3>{loading ? <p className="admin-empty">Loading vendors...</p> : vendors.map((vendor) => <button key={vendor.id} className={`vendor-list-item ${selectedVendor?.id === vendor.id ? "selected" : ""}`} onClick={() => loadVendorDetails(vendor.id)}><Building2 size={20} /><span><b>{vendor.shop_name}</b><small>{vendor.owner_name}</small></span></button>)}</aside>
            <section className="vendor-detail-card">
                {detailsLoading ? <p className="admin-empty">Loading vendor information...</p> : !selectedVendor ? <p className="admin-empty">Select a vendor to view information.</p> : <>
                    <div className="vendor-profile-header">
                        <div className="shop-image">{imageUrl(selectedVendor.shop_photo) ? <img src={imageUrl(selectedVendor.shop_photo)} alt={selectedVendor.shop_name} /> : <Building2 size={42} />}</div>
                        <div><h3>{selectedVendor.shop_name}</h3><p><span className={`admin-status ${selectedVendor.status?.toLowerCase()}`}>{selectedVendor.status}</span></p></div>
                    </div>
                    <div className="vendor-details-grid">
                        <Detail icon={<UserRound size={18} />} label="Owner Name" value={selectedVendor.owner_name} />
                        <Detail icon={<Phone size={18} />} label="Mobile Number" value={selectedVendor.mobile} />
                        <Detail icon={<FileText size={18} />} label="Email Address" value={selectedVendor.email} />
                        <Detail icon={<FileText size={18} />} label="License Number" value={selectedVendor.license_number} />
                        <Detail icon={<FileText size={18} />} label="GST Number" value={selectedVendor.gst_number} />
                        <Detail icon={<Building2 size={18} />} label="Legal Business Name" value={selectedVendor.vendor_legal_name} />
                        <Detail icon={<Building2 size={18} />} label="Business Type" value={selectedVendor.business_type} />
                        <Detail icon={<UserRound size={18} />} label="Primary Contact Person" value={selectedVendor.primary_contact_person} />
                        <Detail icon={<FileText size={18} />} label="Regulatory Certifications" value={selectedVendor.regulatory_certifications} />
                        <Detail icon={<FileText size={18} />} label="Bank Account Details" value={selectedVendor.bank_account_details} />
                        <Detail icon={<FileText size={18} />} label="License Proof" value={selectedVendor.license_photo ? <a href={licenseUrl(selectedVendor.license_photo)} target="_blank" rel="noreferrer">View uploaded document</a> : "Not provided"} />
                        <Detail icon={<MapPin size={18} />} label="Address" value={[selectedVendor.address, selectedVendor.city, selectedVendor.state, selectedVendor.pincode].filter(Boolean).join(", ")} />
                    </div>
                </>}
            </section>
        </div>
    </MainLayout>;
}

function Detail({ icon, label, value }) {
    return <div className="vendor-detail"><span>{icon}</span><div><small>{label}</small><p>{value || "Not provided"}</p></div></div>;
}

export default VendorInfo;
