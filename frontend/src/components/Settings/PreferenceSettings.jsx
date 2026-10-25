
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./PreferenceSettings.css";

function PreferenceSettings() {

    const { t, i18n } = useTranslation();

    const [preferences, setPreferences] = useState({

        language: localStorage.getItem("language") || "en",

        emailNotification: true,

        pushNotification: true,

        darkMode: false

    });

    // ==========================
    // Change Language
    // ==========================

    const handleLanguage = (e) => {

        const language = e.target.value;

        setPreferences({

            ...preferences,

            language

        });

        localStorage.setItem("language", language);

        i18n.changeLanguage(language);

        window.dispatchEvent(new Event("languageChanged"));

    };

    return (

        <div className="preference-card">

            <h3>{t("Preferences")}</h3>

            <div className="preference-grid">

                <div>

                    <label>{t("Language")}</label>

                    <select

                        value={preferences.language}

                        onChange={handleLanguage}

                    >

                        <option value="en">English</option>

                        <option value="mr">मराठी</option>

                        <option value="hi">हिन्दी</option>

                        <option value="gu">ગુજરાતી</option>

                        <option value="ta">தமிழ்</option>

                        <option value="te">తెలుగు</option>

                        <option value="kn">ಕನ್ನಡ</option>

                        <option value="ml">മലയാളം</option>

                        <option value="bn">বাংলা</option>

                        <option value="pa">ਪੰਜਾਬੀ</option>

                        <option value="as">অসমীয়া</option>

                        <option value="od">ଓଡ଼ିଆ</option>

                        <option value="ur">اردو</option>

                    </select>

                </div>

                <label>

                    <input

                        type="checkbox"

                        checked={preferences.emailNotification}

                        onChange={() =>

                            setPreferences({

                                ...preferences,

                                emailNotification: !preferences.emailNotification

                            })

                        }

                    />

                    {t("Email Notifications")}

                </label>

                <label>

                    <input

                        type="checkbox"

                        checked={preferences.pushNotification}

                        onChange={() =>

                            setPreferences({

                                ...preferences,

                                pushNotification: !preferences.pushNotification

                            })

                        }

                    />

                    {t("Push Notifications")}

                </label>

                <label>

                    <input

                        type="checkbox"

                        checked={preferences.darkMode}

                        onChange={() =>

                            setPreferences({

                                ...preferences,

                                darkMode: !preferences.darkMode

                            })

                        }

                    />

                    {t("Dark Mode")}

                </label>

            </div>

        </div>

    );

}

export default PreferenceSettings;

