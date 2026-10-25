import { useNavigate } from "react-router-dom";
import { Search, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./HeroBanner.css";

function HeroBanner() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const name = user.username || user.name || t("careSeeker", "Care Seeker");

    return (
        <div className="hero-banner">
            <div className="hero-content">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    <span>{t("trustedHealthcarePartner", "Your Trusted Healthcare Partner")}</span>
                </div>
                <h1>{t("welcomeBack", "Welcome Back")}, {name}! 👋</h1>
                <p>{t("searchMedicinesDesc", "Search medicines from verified nearby pharmacies and reserve instantly with ease.")}</p>

                <div className="hero-actions">
                    <button
                        type="button"
                        className="hero-btn primary"
                        onClick={() => navigate("/customer/medicines")}
                    >
                        <Search size={18} />
                        <span>{t("searchMedicines", "Search Medicines")}</span>
                    </button>

                    <button
                        type="button"
                        className="hero-btn secondary"
                        onClick={() => navigate("/customer/pharmacies")}
                    >
                        <Building2 size={18} />
                        <span>{t("browsePharmacies", "Browse Pharmacies")}</span>
                    </button>
                </div>
            </div>

            <div className="hero-decor">
                <div className="hero-pill-badge">
                    <ShieldCheck size={22} />
                    <div>
                        <strong>{t("verifiedNetwork", "Verified Network")}</strong>
                        <small>{t("genuineMedicines", "100% Genuine Medicines")}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;