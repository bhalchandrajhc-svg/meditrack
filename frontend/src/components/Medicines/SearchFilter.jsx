import { useTranslation } from "react-i18next";
import "./SearchFilter.css";
import { Search } from "lucide-react";

function SearchFilter({
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus
}) {

    const { t } = useTranslation();

    return (

        <div className="search-filter">

            <div className="search-box">

                <Search size={18} />

                <input
                    type="text"
                    placeholder={t("Search medicine...")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >

                <option value="All Categories">{t("All Categories")}</option>
                <option value="Tablet">{t("categoryTablet") || "Tablet"}</option>
                <option value="Syrup">{t("categorySyrup") || "Syrup"}</option>
                <option value="Capsule">{t("categoryCapsule") || "Capsule"}</option>
                <option value="Injection">{t("categoryInjection") || "Injection"}</option>

            </select>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >

                <option value="All Status">{t("All Status")}</option>
                <option value="In Stock">{t("In Stock")}</option>
                <option value="Low Stock">{t("Low Stock")}</option>
                <option value="Out Of Stock">{t("Out Of Stock")}</option>

            </select>

            <button
                className="reset-btn"
                onClick={() => {
                    setSearch("");
                    setCategory("All Categories");
                    setStatus("All Status");
                }}
            >
                {t("Reset")}
            </button>

        </div>

    );

}

export default SearchFilter;