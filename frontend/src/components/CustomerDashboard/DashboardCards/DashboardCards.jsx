import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Package, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./DashboardCards.css";

import { getDashboardSummary } from "../../../api/customerDashboardApi";

function DashboardCards() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [summary, setSummary] = useState({
        totalReservations: 0,
        pendingReservations: 0,
        completedReservations: 0,
        nearbyPharmacies: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.id) {
                return;
            }

            const { data } = await getDashboardSummary(user.id);

            setSummary({
                totalReservations: data.totalReservations ?? 0,
                pendingReservations: data.pendingReservations ?? 0,
                completedReservations: data.completedReservations ?? 0,
                nearbyPharmacies: data.nearbyPharmacies ?? 0
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
        }
    };

    const cardsData = [
        {
            id: "pharmacies",
            title: t("nearbyPharmaciesCount", "Nearby Pharmacies"),
            count: summary.nearbyPharmacies,
            subtitle: t("browseLocalShops", "Browse local medical shops"),
            icon: <Building2 size={24} />,
            color: "blue",
            link: "/customer/pharmacies"
        },
        {
            id: "total",
            title: t("totalReservations", "Total Reservations"),
            count: summary.totalReservations,
            subtitle: t("allReservedMedicines", "All reserved medicines"),
            icon: <Package size={24} />,
            color: "indigo",
            link: "/customer/orders"
        },
        {
            id: "pending",
            title: t("pendingReservations", "Pending Reservations"),
            count: summary.pendingReservations,
            subtitle: t("awaitingConfirmation", "Awaiting store confirmation"),
            icon: <Clock size={24} />,
            color: "amber",
            link: "/customer/orders"
        },
        {
            id: "completed",
            title: t("completedReservations", "Completed Reservations"),
            count: summary.completedReservations,
            subtitle: t("collectedFulfilled", "Collected & fulfilled orders"),
            icon: <CheckCircle2 size={24} />,
            color: "emerald",
            link: "/customer/orders"
        }
    ];

    return (
        <div className="dashboard-cards">
            {cardsData.map((card) => (
                <div
                    key={card.id}
                    className={`dashboard-card card-theme-${card.color}`}
                    onClick={() => navigate(card.link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(card.link)}
                >
                    <div className="card-header-row">
                        <div className="card-icon-wrap">
                            {card.icon}
                        </div>
                        <span className="card-action-hint">
                            {t("view", "View")} <ChevronRight size={16} />
                        </span>
                    </div>
                    <div className="card-body-row">
                        <h2>{card.count}</h2>
                        <h3>{card.title}</h3>
                        <p>{card.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;