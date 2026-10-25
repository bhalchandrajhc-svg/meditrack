import { useTranslation } from "react-i18next";
import "./InventoryFilter.css";

function InventoryFilter({

    search,
    setSearch,

    category,
    setCategory,

    stockStatus,
    setStockStatus

}) {

    const { t } = useTranslation();

    return (

        <div className="inventory-filter">

            <input
                type="text"
                placeholder={t("Search medicine...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >

                <option value="All Categories">{t("All Categories")}</option>
                <option value="Tablet">{t("categoryTablet") || "Tablet"}</option>
                <option value="Capsule">{t("categoryCapsule") || "Capsule"}</option>
                <option value="Syrup">{t("categorySyrup") || "Syrup"}</option>
                <option value="Injection">{t("categoryInjection") || "Injection"}</option>

            </select>

            <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
            >

                <option value="All Stock">{t("All Status") || "All Stock"}</option>
                <option value="In Stock">{t("In Stock")}</option>
                <option value="Low Stock">{t("Low Stock")}</option>
                <option value="Out Of Stock">{t("Out Of Stock")}</option>

            </select>

        </div>

    );

}

export default InventoryFilter;