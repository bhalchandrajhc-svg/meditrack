import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import "./OrderSearchFilter.css";

function OrderSearchFilter({
    search,
    setSearch,
    status,
    setStatus,
}) {

    const { t } = useTranslation();

    return (

        <div className="order-search-filter">

            <div className="order-search-box">

                <Search size={18} />

                <input
                    type="text"
                    placeholder={t("searchOrders") || "Search by Order ID or Customer..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >

                <option value="All Status">{t("All Status")}</option>
                <option value="Pending">{t("pending")}</option>
                <option value="Accepted">{t("accepted")}</option>
                <option value="Rejected">{t("cancelled") || "Rejected"}</option>
                <option value="Ready for Pickup">{t("readyPickup")}</option>
                <option value="Completed">{t("completed")}</option>

            </select>

            <button
                className="reset-btn"
                onClick={() => {

                    setSearch("");
                    setStatus("All Status");

                }}
            >

                {t("Reset")}

            </button>

        </div>

    );

}

export default OrderSearchFilter;