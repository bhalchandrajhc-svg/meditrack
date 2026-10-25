import { useTranslation } from "react-i18next";
import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import AccountSettings from "../../../components/CustomerSettings/AccountSettings/AccountSettings";
import SecuritySettings from "../../../components/CustomerSettings/SecuritySettings/SecuritySettings";
import PreferenceSettings from "../../../components/CustomerSettings/PreferenceSettings/PreferenceSettings";
import { SlidersHorizontal } from "lucide-react";
import "./Settings.css";

function Settings() {
    const { t } = useTranslation();

    return (
        <CustomerLayout>
            <div className="customer-settings-page">

                {/* Hero Banner */}
                <div className="settings-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <SlidersHorizontal size={14} />
                            <span>{t("settingsAccountBadge", "Account Management")}</span>
                        </div>
                        <h2>{t("settingsTitle", "Settings")}</h2>
                        <p>{t("settingsSubtitle", "Manage your account preferences and security")}</p>
                    </div>
                </div>

                {/* Settings Cards */}
                <AccountSettings />
                <SecuritySettings />
                <PreferenceSettings />

            </div>
        </CustomerLayout>
    );
}

export default Settings;