import { useState } from "react";
import axios from "axios";
import { Check, HeartPulse } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        role: "customer", 
        username: "", 
        email: "", 
        password: "" 
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
            alert("Signup Successful. OTP Sent to Email.");
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || "Signup Failed");
        }
    };

    return <main className="auth-page"><section className="auth-shell">
        <aside className="auth-aside">
            <div className="auth-brand"><span className="auth-brand-mark"><HeartPulse size={17} /></span>Medi Track</div>
            <div className="auth-aside-content"><h1>Health care, made easier.</h1><p>Create your account to discover medicines and manage your pharmacy needs with confidence.</p><ul className="auth-benefits"><li><span className="auth-benefit-dot"><Check size={11} /></span>Find medicines near you</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Secure, simple registration</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Verified pharmacy support</li></ul></div>
            <small className="auth-aside-footer">Medi Track · Better care, every day</small>
        </aside>
        <div className="auth-form-area"><div className="auth-form-wrap">
            <h2>Create your account</h2><p className="auth-intro">Start managing your health needs in a few minutes.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="mb-3"><label className="form-label">Full name</label><input type="text" name="username" className="form-control" placeholder="Enter your name" value={formData.username} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Email address</label><input type="email" name="email" className="form-control" placeholder="you@example.com" value={formData.email} onChange={handleChange} required /></div>
                <div className="mb-4"><label className="form-label">Password</label><input type="password" name="password" className="form-control" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required /></div>
                <button type="submit" className="btn btn-success w-100 auth-submit">Create account</button>
            </form>
            <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
            <p className="auth-footer" style={{ marginTop: "10px" }}><Link to="/vendor">Are you a Pharmacy? Vendor Login</Link></p>
        </div></div>
    </section></main>;
}

export default Signup;
