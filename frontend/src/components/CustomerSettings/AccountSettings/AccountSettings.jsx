import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { getTheme, applyTheme } from "../../../utils/theme";
import "./AccountSettings.css";

function AccountSettings() {
    const { t, i18n } = useTranslation();

    const [currentTheme, setCurrentTheme] = useState(getTheme());

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const changeTheme = (theme) => {
        setCurrentTheme(applyTheme(theme));
    };

    const currentLang = i18n.language || "en";

    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <div className="settings-card-icon blue">
                    <Globe size={20} />
                </div>
                <h3>{t("accountPreferencesSection", "Account & Preferences")}</h3>
            </div>

            <div className="settings-card-body">
                {/* Language */}
                <div className="setting-row">
                    <label>{t("language", "Language")}</label>
                    <select
                        className="setting-select"
                        value={currentLang}
                        onChange={(e) => changeLanguage(e.target.value)}
                    >
                        {!["en", "mr", "hi"].includes(currentLang) && (
                            <option value={currentLang} style={{ display: "none" }}>
                                {currentLang}
                            </option>
                        )}
                        <option value="en">{t("english", "English")}</option>
                        <option value="mr">{t("marathi", "मराठी")}</option>
                        <option value="hi">{t("hindi", "हिन्दी")}</option>
                    </select>
                </div>

                {/* Theme */}
                <div className="setting-row">
                    <label>{t("theme", "Theme")}</label>
                    <select
                        className="setting-select"
                        value={currentTheme}
                        onChange={(e) => changeTheme(e.target.value)}
                    >
                        <option value="light">{t("light", "Light")}</option>
                        <option value="dark">{t("dark", "Dark")}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;