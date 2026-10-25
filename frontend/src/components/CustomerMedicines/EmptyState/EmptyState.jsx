import { PackageSearch, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./EmptyState.css";

function EmptyState({ search, category, inStockOnly, onReset }) {
    const { t } = useTranslation();

    return (
        <div className="medicines-empty-state">
            <div className="empty-icon-wrapper">
                <PackageSearch size={44} className="empty-icon" />
            </div>
            <h3>{t("noMedicinesFound", "No Medicines Found")}</h3>
            <p>
                {search || category !== "All" || inStockOnly
                    ? t("noMedicinesFiltered", "No medicines matched your current filters. Try searching for something else or reset filters.")
                    : t("noMedicinesAvailable", "No medicines are currently available in the catalog.")}
            </p>
            {(search || category !== "All" || inStockOnly) && (
                <button className="reset-filters-btn" onClick={onReset}>
                    <RotateCcw size={16} />
                    {t("resetAllFilters", "Reset All Filters")}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
