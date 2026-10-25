import { useNavigate } from "react-router-dom";
import { Search, Building2, Package, Bell, User, PhoneCall, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./QuickActions.css";

function QuickActions() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const actions = [
        {
            title: t("findMedicinesAction", "Find Medicines"),
            desc: t("findMedicinesDesc", "Search stock by name or category"),
            icon: <Search size={22} />,
            color: "blue",
            link: "/customer/medicines"
        },
        {
            title: t("nearbyPharmaciesAction", "Nearby Pharmacies"),
            desc: t("nearbyPharmaciesDesc", "Locate medical shops around you"),
            icon: <Building2 size={22} />,
            color: "emerald",
            link: "/customer/pharmacies"
        },
        {
            title: t("myReservations", "My Reservations"),
            desc: t("myReservationsDesc", "Check status of reserved medicines"),
            icon: <Package size={22} />,
            color: "purple",
            link: "/customer/orders"
        },
        {
            title: t("notificationsAction", "Notifications"),
            desc: t("notificationsDesc", "View store approvals & updates"),
            icon: <Bell size={22} />,
            color: "amber",
            link: "/customer/notifications"
        },
        {
            title: t("myProfile", "My Profile"),
            desc: t("myProfileDesc", "Manage account and address details"),
            icon: <User size={22} />,
            color: "indigo",
            link: "/customer/profile"
        },
        {
            title: t("emergencyHelpline", "Emergency Helpline"),
            desc: t("emergencyHelplineDesc", "Instant access to medical hotlines"),
            icon: <PhoneCall size={22} />,
            color: "rose",
            onClick: () => {
                const emergencyEl = document.getElementById("emergency-section");
                if (emergencyEl) {
                    emergencyEl.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    ];

    return (
        <section className="quick-actions-section">
            <div className="section-header">
                <div>
                    <h2>{t("quickActions", "Quick Actions")}</h2>
                    <p>{t("fastAccess", "Fast access to common tasks and services")}</p>
                </div>
            </div>

            <div className="quick-actions-grid">
                {actions.map((act, index) => (
                    <div
                        key={index}
                        className={`action-card theme-${act.color}`}
                        onClick={() => act.onClick ? act.onClick() : navigate(act.link)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && (act.onClick ? act.onClick() : navigate(act.link))}
                    >
                        <div className="action-icon">
                            {act.icon}
                        </div>
                        <div className="action-info">
                            <h3>{act.title}</h3>
                            <p>{act.desc}</p>
                        </div>
                        <span className="action-arrow">
                            <ArrowRight size={16} />
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default QuickActions;