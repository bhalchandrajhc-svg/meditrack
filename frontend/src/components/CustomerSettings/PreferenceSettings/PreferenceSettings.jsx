import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Save } from "lucide-react";
import "./PreferenceSettings.css";

function PreferenceSettings() {
    const { t } = useTranslation();

    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        orderUpdates: true,
        medicineOffers: false
    });

    const toggle = (key) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const items = [
        {
            key: "emailNotifications",
            label: t("emailNotifications", "Email Notifications"),
            desc: t("emailNotifDesc", "Receive email alerts for account activity")
        },
        {
            key: "orderUpdates",
            label: t("orderUpdates", "Order Updates"),
            desc: t("orderUpdatesDesc", "Get notified when order status changes")
        },
        {
            key: "medicineOffers",
            label: t("medicineOffers", "Medicine Offers"),
            desc: t("medicineOffersDesc", "Promotions and deals from nearby pharmacies")
        }
    ];

    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <div className="settings-card-icon purple">
                    <Bell size={20} />
                </div>
                <h3>{t("notificationPreferences", "Notification Preferences")}</h3>
            </div>

            <div className="settings-card-body">
                <div className="preference-list">
                    {items.map((item) => (
                        <div key={item.key} className="preference-item">
                            <div className="preference-label">
                                <strong>{item.label}</strong>
                                <span>{item.desc}</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={prefs[item.key]}
                                    onChange={() => toggle(item.key)}
                                />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    ))}
                </div>

                <button type="button" className="save-preferences-btn">
                    <Save size={15} />
                    <span>{t("savePreferences", "Save Preferences")}</span>
                </button>
            </div>
        </div>
    );
}

export default PreferenceSettings;