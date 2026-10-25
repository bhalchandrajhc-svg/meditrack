import { useState } from "react";
import axios from "axios";
import { Check, HeartPulse } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState({
        email: location.state?.email || "",
        otp: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/auth/verify-otp`,
                data
            );
            alert(res.data.message || "OTP verified successfully!");
            navigate("/login");
        } catch (error) {
            alert(
                error.response?.data?.message || "OTP Verification Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell">
                <aside className="auth-aside">
                    <div className="auth-brand">
                        <span className="auth-brand-mark"><HeartPulse size={17} /></span>
                        Medi Track
                    </div>
                    <div className="auth-aside-content">
                        <h1>Verify your account.</h1>
                        <p>Enter the verification code sent to your email to complete registration.</p>
                        <ul className="auth-benefits">
                            <li><span className="auth-benefit-dot"><Check size={11} /></span>Instant identity verification</li>
                            <li><span className="auth-benefit-dot"><Check size={11} /></span>Secure account protection</li>
                            <li><span className="auth-benefit-dot"><Check size={11} /></span>Quick 1-step activation</li>
                        </ul>
                    </div>
                    <small className="auth-aside-footer">Medi Track · Care made simpler</small>
                </aside>
                <div className="auth-form-area">
                    <div className="auth-form-wrap">
                        <h2>Verify OTP</h2>
                        <p className="auth-intro">Please enter your email and the OTP code received.</p>
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="form-control"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Enter OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP code"
                                    className="form-control"
                                    value={data.otp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100 auth-submit" disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                        <p className="auth-footer">
                            Already verified? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default VerifyOtp;