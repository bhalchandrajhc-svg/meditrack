import { useState } from "react";
import axios from "axios";
import { Check, HeartPulse, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMsg("");
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
            localStorage.setItem("admin_token", response.data.token);
            localStorage.setItem("admin", JSON.stringify(response.data.admin));
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Admin login failed");
        } finally { setLoading(false); }
    };

    return <main className="auth-page"><section className="auth-shell">
        <aside className="auth-aside">
            <div className="auth-brand"><span className="auth-brand-mark"><HeartPulse size={17} /></span>Medi Track</div>
            <div className="auth-aside-content"><h1>Secure administration, simplified.</h1><p>Review vendor registrations and keep your pharmacy network trusted.</p><ul className="auth-benefits"><li><span className="auth-benefit-dot"><Check size={11} /></span>Review vendor applications</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Monitor platform activity</li><li><span className="auth-benefit-dot"><Check size={11} /></span>Protected administrator access</li></ul></div>
            <small className="auth-aside-footer">Medi Track · Administrator portal</small>
        </aside>
        <div className="auth-form-area"><div className="auth-form-wrap">
            {isForgotPassword ? (
                <ForgotPasswordForm
                    role="admin"
                    initialEmail={email}
                    onBack={() => setIsForgotPassword(false)}
                    onResetSuccess={(resetEmail) => {
                        setIsForgotPassword(false);
                        setEmail(resetEmail);
                        setPassword("");
                        setSuccessMsg("Admin password reset successfully! Please log in with your new password.");
                    }}
                />
            ) : (
                <>
                    <h2><ShieldCheck size={26} className="me-2" />Admin login</h2>
                    <p className="auth-intro">Sign in to access the Medi Track admin portal.</p>

                    {successMsg && (
                        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-3" style={{ fontSize: "13px" }}>
                            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="mb-3">
                            <label className="form-label">Admin email</label>
                            <input type="email" className="form-control" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label mb-0">Password</label>
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => { setIsForgotPassword(true); setError(""); setSuccessMsg(""); }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <div className="alert auth-error py-2">{error}</div>}
                        <button type="submit" className="btn btn-success w-100 auth-submit" disabled={loading}>{loading ? "Logging In..." : "Login as Admin"}</button>
                    </form>
                    <p className="auth-footer"><Link to="/login">Back to user login</Link></p>
                </>
            )}
        </div></div>
    </section></main>;
}

export default AdminLogin;
