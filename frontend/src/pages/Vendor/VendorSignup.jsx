import { useState } from "react";
import axios from "axios";
import { Check, HeartPulse } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function VendorSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        role: "vendor", 
        username: "", 
        shop_name: "", 
        email: "", 
        mobile: "", 
        license_number: "", 
        gst_number: "", 
        vendor_legal_name: "", 
        business_type: "", 
        primary_contact_person: "", 
        regulatory_certifications: "", 
        bank_account_details: "", 
        license_photo: null, 
        password: "" 
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => { 
                if (key !== "license_photo" && value !== null) data.append(key, value); 
            });
            if (formData.license_photo) data.append("license_photo", formData.license_photo);
            
            await axios.post(`${API_BASE_URL}/api/auth/signup`, data);
            alert("Signup Successful. OTP Sent to Email.");
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || "Signup Failed");
        }
    };

    return <main className="auth-page"><section className="auth-shell">
        <aside className="auth-aside" style={{ backgroundColor: "#1e3a8a" }}>
            <div className="auth-brand"><span className="auth-brand-mark"><HeartPulse size={17} /></span>Medi Track Vendor</div>
            <div className="auth-aside-content"><h1>Empower your Pharmacy.</h1><p>Join our network to manage orders, inventory, and grow your business with smart analytics.</p><ul className="auth-benefits"><li><span className="auth-benefit-dot"><Check size={11} /></span>Real-time order management</li><li><span className="auth-benefit-dot"><Check size={11} /></span>AI-powered inventory insights</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Reach more customers locally</li></ul></div>
            <small className="auth-aside-footer">Medi Track · Better business, every day</small>
        </aside>
        <div className="auth-form-area"><div className="auth-form-wrap">
            <h2>Register your Pharmacy</h2><p className="auth-intro">Start managing your store online in a few minutes.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="mb-3"><label className="form-label">Owner name</label><input type="text" name="username" className="form-control" placeholder="Enter your name" value={formData.username} onChange={handleChange} required /></div>
                
                <div className="auth-vendor-section">
                    <h3>Pharmacy details</h3>
                    <p>These details are reviewed before your vendor account is approved.</p>
                    <div className="auth-form-grid">
                        <div className="mb-3"><label className="form-label">Medical shop name</label><input type="text" name="shop_name" className="form-control" placeholder="Your shop name" value={formData.shop_name} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Mobile number</label><input type="text" name="mobile" className="form-control" placeholder="10-digit number" value={formData.mobile} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Legal business name</label><input type="text" name="vendor_legal_name" className="form-control" placeholder="Registered company name" value={formData.vendor_legal_name} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Business type</label><select name="business_type" className="form-control" value={formData.business_type} onChange={handleChange} required><option value="">Select type</option><option value="Manufacturer">Manufacturer</option><option value="Distributor">Distributor</option><option value="Service Provider">Service Provider</option><option value="Importer">Importer</option><option value="Other">Other</option></select></div>
                        <div className="mb-3"><label className="form-label">Primary contact person</label><input type="text" name="primary_contact_person" className="form-control" placeholder="Contact person name" value={formData.primary_contact_person} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Drug license number</label><input type="text" name="license_number" className="form-control" placeholder="License number" value={formData.license_number} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">GST number (Tax ID)</label><input type="text" name="gst_number" className="form-control" placeholder="GSTIN / Tax ID" value={formData.gst_number} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">License proof</label><input type="file" className="form-control" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFormData({ ...formData, license_photo: e.target.files?.[0] || null })} required /></div>
                    </div>
                    <div className="mb-3"><label className="form-label">Regulatory certifications</label><textarea name="regulatory_certifications" className="form-control" placeholder="e.g. ISO 13485, GMP" value={formData.regulatory_certifications} onChange={handleChange} rows="2" /></div>
                    <div className="mb-0"><label className="form-label">Bank account details</label><textarea name="bank_account_details" className="form-control" placeholder="Bank name, account number and IFSC/SWIFT" value={formData.bank_account_details} onChange={handleChange} rows="2" required /></div>
                </div>

                <div className="mb-3"><label className="form-label">Email address</label><input type="email" name="email" className="form-control" placeholder="vendor@example.com" value={formData.email} onChange={handleChange} required /></div>
                <div className="mb-4"><label className="form-label">Password</label><input type="password" name="password" className="form-control" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required /></div>
                
                <button type="submit" className="btn btn-success w-100 auth-submit">Create vendor account</button>
            </form>
            <p className="auth-footer">Already registered? <Link to="/vendor">Sign in to Pharmacy</Link></p>
            <p className="auth-footer" style={{ marginTop: "10px" }}><Link to="/">Not a vendor? Customer Signup</Link></p>
        </div></div>
    </section></main>;
}

export default VendorSignup;
