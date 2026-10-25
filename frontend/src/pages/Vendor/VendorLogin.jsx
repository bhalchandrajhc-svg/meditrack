import { useState } from "react";
import axios from "axios";
import { Check, HeartPulse, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm";

function VendorLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ role: "vendor", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("vendor", JSON.stringify(res.data.user));
            localStorage.setItem("vendor_token", res.data.token);
            alert("Vendor Login Successful");
            navigate("/vendor/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return <main className="auth-page"><section className="auth-shell">
        <aside className="auth-aside" style={{ backgroundColor: "#1e3a8a" }}>
            <div className="auth-brand"><span className="auth-brand-mark"><HeartPulse size={17} /></span>Medi Track Vendor</div>
            <div className="auth-aside-content"><h1>Empower your Pharmacy.</h1><p>Join our network to manage orders, inventory, and grow your business with smart analytics.</p><ul className="auth-benefits"><li><span className="auth-benefit-dot"><Check size={11} /></span>Real-time order management</li><li><span className="auth-benefit-dot"><Check size={11} /></span>AI-powered inventory insights</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Reach more customers locally</li></ul></div>
            <small className="auth-aside-footer">Medi Track · Better business, every day</small>
        </aside>
        <div className="auth-form-area"><div className="auth-form-wrap">
            {isForgotPassword ? (
                <ForgotPasswordForm
                    role="vendor"
                    initialEmail={formData.email}
                    onBack={() => setIsForgotPassword(false)}
                    onResetSuccess={(resetEmail) => {
                        setIsForgotPassword(false);
                        setFormData((prev) => ({ ...prev, email: resetEmail, password: "" }));
                        setSuccessMsg("Password reset successfully! Please log in with your new password.");
                    }}
                />
            ) : (
                <>
                    <h2>Pharmacy Login</h2>
                    <p className="auth-intro">Sign in to manage your medical store.</p>

                    {successMsg && (
                        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-3" style={{ fontSize: "13px" }}>
                            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" placeholder="vendor@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label mb-0">Password</label>
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => { setIsForgotPassword(true); setSuccessMsg(""); }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input type="password" className="form-control" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-success w-100 auth-submit" disabled={loading}>{loading ? "Logging In..." : "Login as Vendor"}</button>
                    </form>
                    <p className="auth-footer">Don't have a vendor account? <Link to="/vendor/signup">Register your Pharmacy</Link></p>
                    <p className="auth-footer" style={{ marginTop: "10px" }}><Link to="/login">Not a vendor? Customer Login</Link></p>
                </>
            )}
        </div></div>
    </section></main>;
}

export default VendorLogin;
