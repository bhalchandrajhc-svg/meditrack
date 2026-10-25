import { PhoneCall, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./EmergencySection.css";

function EmergencySection() {
    const { t } = useTranslation();

    const contacts = [
        {
            titleKey: "ambulanceEmergency",
            titleFallback: "Ambulance & Emergency",
            number: "108",
            descKey: "ambulanceDesc",
            descFallback: "24/7 National Emergency & Medical Dispatch",
            color: "red",
            tel: "tel:108"
        },
        {
            titleKey: "healthHelpline",
            titleFallback: "Health Helpline",
            number: "1075",
            descKey: "healthHelplineDesc",
            descFallback: "Medical Assistance & Toll-Free Helpline",
            color: "blue",
            tel: "tel:1075"
        },
        {
            titleKey: "pharmacySupport",
            titleFallback: "Emergency Pharmacy Support",
            number: "1800-633-4357",
            descKey: "pharmacySupportDesc",
            descFallback: "Urgent medicine location & night dispatch",
            color: "emerald",
            tel: "tel:18006334357"
        },
        {
            titleKey: "poisonControl",
            titleFallback: "Poison Control Center",
            number: "1800-116-117",
            descKey: "poisonControlDesc",
            descFallback: "Toxico-surveillance & emergency antidote advice",
            color: "amber",
            tel: "tel:1800116117"
        }
    ];

    return (
        <section id="emergency-section" className="emergency-section">
            <div className="emergency-banner">
                <div className="emergency-header">
                    <div className="emergency-title-wrap">
                        <span className="emergency-badge">
                            <AlertTriangle size={16} /> {t("emergencyServices", "Emergency Services")}
                        </span>
                        <h2>{t("emergencyContacts", "Emergency Health Contacts & Helplines")}</h2>
                        <p>{t("emergencyDesc", "Immediate 24/7 assistance for critical health emergencies and urgent medicine dispatch.")}</p>
                    </div>
                </div>

                <div className="emergency-cards-grid">
                    {contacts.map((c, index) => (
                        <div key={index} className={`emergency-card theme-${c.color}`}>
                            <div className="emergency-card-top">
                                <span className="emergency-icon">
                                    <PhoneCall size={20} />
                                </span>
                                <span className="emergency-num-badge">{c.number}</span>
                            </div>
                            <h3>{t(c.titleKey, c.titleFallback)}</h3>
                            <p>{t(c.descKey, c.descFallback)}</p>
                            <a href={c.tel} className="emergency-call-btn">
                                <PhoneCall size={14} /> {t("callNow", "Call Now")} ({c.number})
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default EmergencySection;
