import { useState, useEffect } from "react";
import axios from "axios";
import { 
    Mail, 
    KeyRound, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCw, 
    ShieldCheck 
} from "lucide-react";
import { API_BASE_URL } from "../../config";

function ForgotPasswordForm({ role = "customer", initialEmail = "", onBack, onResetSuccess }) {
    // Current active step: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState(initialEmail || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [infoMsg, setInfoMsg] = useState("");

    // Resend countdown timer
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const roleLabel = {
        customer: "Customer",
        vendor: "Pharmacy Vendor",
        admin: "Administrator"
    }[role] || "Account";

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setInfoMsg("");

        if (!email || !email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/send-otp`, {
                email: email.trim(),
                role
            });

            setInfoMsg(res.data?.message || "Verification code sent to your email!");
            setStep(2);
            setTimer(60); // 60-second cooldown
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset code. Please check your email.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setInfoMsg("");

        if (!otp || !otp.trim()) {
            setError("Please enter the 6-digit OTP sent to your email.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
                email: email.trim(),
                otp: otp.trim()
            });

            setInfoMsg(res.data?.message || "OTP verified! Please create your new password.");
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP code.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setInfoMsg("");

        if (!newPassword || newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please re-enter.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/reset-password`, {
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
                role
            });

            setInfoMsg(res.data?.message || "Password updated successfully!");
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            {/* Header / Badge */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold" style={{ fontSize: "12px" }}>
                    {roleLabel} Password Recovery
                </span>
                {step < 4 && (
                    <button 
                        type="button" 
                        className="btn btn-link text-decoration-none text-muted p-0 d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                        onClick={onBack}
                    >
                        <ArrowLeft size={14} /> Back to Login
                    </button>
                )}
            </div>

            {/* Step Indicators */}
            {step < 4 && (
                <div className="auth-step-tracker mb-4">
                    <div className={`auth-step-pill ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
                        <span className="auth-step-num">1</span>
                        <span className="auth-step-text">Email</span>
                    </div>
                    <div className="auth-step-connector" />
                    <div className={`auth-step-pill ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
                        <span className="auth-step-num">2</span>
                        <span className="auth-step-text">Verify OTP</span>
                    </div>
                    <div className="auth-step-connector" />
                    <div className={`auth-step-pill ${step >= 3 ? "active" : ""}`}>
                        <span className="auth-step-num">3</span>
                        <span className="auth-step-text">New Password</span>
                    </div>
                </div>
            )}

            {/* Alert / Feedback Messages */}
            {error && (
                <div className="alert alert-danger d-flex align-items-start gap-2 py-2 px-3 mb-3 auth-alert" role="alert">
                    <AlertCircle size={18} className="mt-1 flex-shrink-0" />
                    <div style={{ fontSize: "13px" }}>{error}</div>
                </div>
            )}

            {infoMsg && step !== 4 && (
                <div className="alert alert-success d-flex align-items-start gap-2 py-2 px-3 mb-3 auth-alert" role="alert">
                    <CheckCircle2 size={18} className="mt-1 flex-shrink-0" />
                    <div style={{ fontSize: "13px" }}>{infoMsg}</div>
                </div>
            )}

            {/* STEP 1: Enter Registered Email */}
            {step === 1 && (
                <form onSubmit={handleSendOtp} className="auth-form">
                    <div className="mb-2">
                        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#172554", marginBottom: "6px" }}>
                            Forgot Password?
                        </h2>
                        <p className="text-muted" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                            Enter your registered <strong>{roleLabel}</strong> email address. We'll send you a 6-digit OTP verification code.
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Registered Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0 ps-0"
                                placeholder={`Enter your registered ${role} email`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 auth-submit mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="d-inline-flex align-items-center gap-2">
                                <RefreshCw size={15} className="spin" /> Sending Verification Code...
                            </span>
                        ) : (
                            "Send Verification Code"
                        )}
                    </button>
                </form>
            )}

            {/* STEP 2: Enter & Verify OTP */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="auth-form">
                    <div className="mb-2">
                        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#172554", marginBottom: "6px" }}>
                            Enter Verification OTP
                        </h2>
                        <p className="text-muted" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                            We've sent a 6-digit code to <strong>{email}</strong>.
                            <button
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none p-0 ms-2 fw-semibold"
                                onClick={() => { setStep(1); setError(""); }}
                            >
                                Change
                            </button>
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">6-Digit Verification Code (OTP)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <KeyRound size={16} />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0 auth-otp-input"
                                placeholder="• • • • • •"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-3" style={{ fontSize: "12px" }}>
                        <span className="text-muted">Didn't receive the OTP?</span>
                        {timer > 0 ? (
                            <span className="text-muted fw-semibold">Resend in {timer}s</span>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none p-0 fw-bold"
                                onClick={() => handleSendOtp()}
                                disabled={loading}
                            >
                                Resend Code
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 auth-submit"
                        disabled={loading || otp.length < 6}
                    >
                        {loading ? (
                            <span className="d-inline-flex align-items-center gap-2">
                                <RefreshCw size={15} className="spin" /> Verifying Code...
                            </span>
                        ) : (
                            "Verify & Continue"
                        )}
                    </button>
                </form>
            )}

            {/* STEP 3: Reset Password */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="auth-form">
                    <div className="mb-2">
                        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#172554", marginBottom: "6px" }}>
                            Set New Password
                        </h2>
                        <p className="text-muted" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                            Create a strong, memorable password for your <strong>{email}</strong> account.
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <Lock size={16} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control border-start-0 border-end-0 ps-0"
                                placeholder="At least 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoFocus
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-light border border-start-0 text-muted"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <Lock size={16} />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control border-start-0 border-end-0 ps-0"
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-light border border-start-0 text-muted"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <small className="text-danger mt-1 d-block" style={{ fontSize: "11px" }}>
                                Passwords do not match
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100 auth-submit mt-2"
                        disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                    >
                        {loading ? (
                            <span className="d-inline-flex align-items-center gap-2">
                                <RefreshCw size={15} className="spin" /> Updating Password...
                            </span>
                        ) : (
                            "Reset & Update Password"
                        )}
                    </button>
                </form>
            )}

            {/* STEP 4: Success Screen */}
            {step === 4 && (
                <div className="text-center py-3">
                    <div className="auth-success-badge mb-3">
                        <ShieldCheck size={48} className="text-success" />
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#172554", marginBottom: "8px" }}>
                        Password Reset Successfully!
                    </h2>
                    <p className="text-muted mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                        Your password for <strong>{email}</strong> has been updated. You can now sign in using your new credentials.
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary w-100 auth-submit"
                        onClick={() => onResetSuccess(email)}
                    >
                        Proceed to Login
                    </button>
                </div>
            )}
        </div>
    );
}

export default ForgotPasswordForm;
