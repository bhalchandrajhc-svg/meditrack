import { useTranslation } from "react-i18next";
import { ShieldCheck, Key, LogOut } from "lucide-react";
import "./SecuritySettings.css";

function SecuritySettings() {
    const { t } = useTranslation();

    const handleChangePassword = () => {
        alert(t("changePassword", "Change Password"));
    };

    const handleLogoutAll = () => {
        if (window.confirm(t("logoutAllDevices", "Logout From All Devices") + "?")) {
            alert(t("loggedOutAllDevices", "Logged out from all devices."));
        }
    };

    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <div className="settings-card-icon red">
                    <ShieldCheck size={20} />
                </div>
                <h3>{t("securitySection", "Security Settings")}</h3>
            </div>

            <div className="settings-card-body">
                <div className="security-btn-group">
                    <button
                        type="button"
                        className="security-btn primary"
                        onClick={handleChangePassword}
                    >
                        <Key size={16} />
                        <span>{t("changePassword", "Change Password")}</span>
                    </button>

                    <button
                        type="button"
                        className="security-btn danger"
                        onClick={handleLogoutAll}
                    >
                        <LogOut size={16} />
                        <span>{t("logoutAllDevices", "Logout From All Devices")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SecuritySettings;