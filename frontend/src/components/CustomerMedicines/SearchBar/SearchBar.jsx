import { Search, MapPin, X, ArrowUpDown, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./SearchBar.css";

function SearchBar({
    search,
    setSearch,
    onSearch,
    nearMe = false,
    setNearMe,
    inStockOnly = false,
    setInStockOnly,
    sortBy = "default",
    setSortBy
}) {
    const { t } = useTranslation();

    const handleClear = () => {
        setSearch("");
        if (onSearch) onSearch("");
    };

    return (
        <div className="medicine-search-container">
            <div className="medicine-search-main">
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && onSearch) {
                                onSearch(search);
                            }
                        }}
                        placeholder={t("searchMedicinesPlaceholder", "Search medicines by name, brand, or component...")}
                    />
                    {search && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={handleClear}
                            title={t("clearSearch", "Clear search")}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="search-btn"
                    onClick={() => onSearch && onSearch(search)}
                >
                    <Search size={18} />
                    <span>{t("searchButton", "Search")}</span>
                </button>
            </div>

            <div className="search-filters-bar">
                <button
                    type="button"
                    className={`filter-toggle-btn location-btn ${nearMe ? "active" : ""}`}
                    onClick={() => setNearMe && setNearMe(!nearMe)}
                >
                    <MapPin size={16} />
                    <span>{t("nearMe", "Near Me")}</span>
                </button>

                <button
                    type="button"
                    className={`filter-toggle-btn instock-btn ${inStockOnly ? "active" : ""}`}
                    onClick={() => setInStockOnly && setInStockOnly(!inStockOnly)}
                >
                    <CheckCircle2 size={16} />
                    <span>{t("inStockOnly", "In Stock Only")}</span>
                </button>

                {setSortBy && (
                    <div className="sort-dropdown-wrapper">
                        <ArrowUpDown size={16} className="sort-icon" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="default">{t("sortByDefault", "Sort by: Default")}</option>
                            <option value="price-low">{t("sortPriceLowHigh", "Price: Low to High")}</option>
                            <option value="price-high">{t("sortPriceHighLow", "Price: High to Low")}</option>
                            <option value="name-asc">{t("sortNameAZ", "Name: A to Z")}</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;