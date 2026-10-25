import { useTranslation } from "react-i18next";
import "./NotificationFilter.css";

function NotificationFilter({

    search,
    setSearch,
    category,
    setCategory

}) {

    const { t } = useTranslation();

    return (

        <div className="notification-filter">

            <input
                type="text"
                placeholder={t("Search medicine...") || "Search notifications..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >

                <option value="All">{t("all")}</option>

                <option value="Medicines">{t("medicines")}</option>

                <option value="Orders">{t("orders")}</option>

                <option value="Inventory">{t("inventory")}</option>

                <option value="System">{t("settings")}</option>

            </select>

        </div>

    );

}

export default NotificationFilter;