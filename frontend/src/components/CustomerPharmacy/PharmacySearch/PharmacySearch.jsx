import { Search, MapPin, X, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./PharmacySearch.css";

function PharmacySearch({
    search,
    setSearch,
    radius = 5,
    handleRadiusChange,
    onUseLocation
}) {
    const { t } = useTranslation();

    const handleClear = () => {
        setSearch("");
    };

    return (
        <div className="pharmacy-search-wrapper">
            <div className="pharmacy-search-main">
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder={t("searchPharmacyPlaceholder", "Search pharmacy by name, city, or address...")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

                {onUseLocation && (
                    <button
                        type="button"
                        className="location-trigger-btn"
                        onClick={onUseLocation}
                        title={t("detectCurrentLocation", "Detect current location")}
                    >
                        <Navigation size={18} />
                        <span>{t("useMyLocation", "Use My Location")}</span>
                    </button>
                )}
            </div>

            <div className="pharmacy-search-filters">
                <div className="radius-selector-pill">
                    <MapPin size={16} className="pill-icon" />
                    <label htmlFor="radius-select">{t("searchRadius", "Search Radius:")}</label>
                    <select
                        id="radius-select"
                        value={radius}
                        onChange={handleRadiusChange}
                        className="radius-select"
                    >
                        <option value="all">{t("allPharmaciesOption", "All Pharmacies (No Limit)")}</option>
                        <option value={5}>{t("withinKm", "Within {{km}} KM", { km: 5 })}</option>
                        <option value={10}>{t("withinKm", "Within {{km}} KM", { km: 10 })}</option>
                        <option value={25}>{t("withinKm", "Within {{km}} KM", { km: 25 })}</option>
                        <option value={50}>{t("withinKm", "Within {{km}} KM", { km: 50 })}</option>
                        <option value={100}>{t("withinKm", "Within {{km}} KM", { km: 100 })}</option>
                        <option value={200}>{t("withinKm", "Within {{km}} KM", { km: 200 })}</option>
                        <option value={500}>{t("withinKm", "Within {{km}} KM", { km: 500 })}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default PharmacySearch;