import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import PharmacySearch from "../../../components/CustomerPharmacy/PharmacySearch/PharmacySearch";
import { getNearbyPharmacies } from "../../../services/customerService";
import {
    MapPin,
    Store,
    Phone,
    User,
    Navigation,
    Sparkles,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    ShoppingBag,
    FilterX
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./NearbyPharmacies.css";

function NearbyPharmacies() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [pharmacies, setPharmacies] = useState([]);
    const [search, setSearch] = useState("");
    const [radius, setRadius] = useState("all");
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
    });
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState("");

    // =====================================
    // Load Nearby Pharmacies
    // =====================================
    const loadPharmacies = useCallback(
        async (latitude, longitude, selectedRadius) => {
            try {
                setLoading(true);
                const res = await getNearbyPharmacies(
                    latitude,
                    longitude,
                    selectedRadius
                );
                setPharmacies(res.data.pharmacies || []);
            } catch (err) {
                console.error("Nearby Pharmacy Error:", err);
                setPharmacies([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // =====================================
    // Get Location Handler
    // =====================================
    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError("geolocationUnsupported");
            setLoading(false);
            loadPharmacies(null, null, radius);
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLocation({ latitude, longitude });
                setLocationError("");
                loadPharmacies(latitude, longitude, radius);
            },
            (error) => {
                console.error("Location Error:", error);
                setLocationError("allowLocation");
                // Don't hide vendors if GPS permission fails
                loadPharmacies(null, null, radius);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, [loadPharmacies, radius]);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    // =====================================
    // Radius Change
    // =====================================
    const handleRadiusChange = async (e) => {
        const val = e.target.value;
        const newRadius = val === "all" ? "all" : Number(val);
        setRadius(newRadius);
        await loadPharmacies(location.latitude, location.longitude, newRadius);
    };

    // =====================================
    // Show All Pharmacies Handler
    // =====================================
    const handleShowAll = async () => {
        setRadius("all");
        setSearch("");
        await loadPharmacies(location.latitude, location.longitude, "all");
    };

    // =====================================
    // Filtered Pharmacies
    // =====================================
    const filteredPharmacies = useMemo(() => {
        const keyword = search.toLowerCase().trim();
        if (!keyword) return pharmacies;

        return pharmacies.filter((shop) => {
            const shopName = (shop.shop_name || "").toLowerCase();
            const city = (shop.city || "").toLowerCase();
            const address = (shop.address || "").toLowerCase();
            return shopName.includes(keyword) || city.includes(keyword) || address.includes(keyword);
        });
    }, [pharmacies, search]);

    return (
        <CustomerLayout>
            <div className="nearby-pharmacies-page">
                {/* Hero Header */}
                <div className="nearby-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Navigation size={14} />
                            <span>{t("realTimeGPS", "Real-Time GPS Pharmacy Finder")}</span>
                        </div>
                        <h2>{t("nearbyPharmaciesTitle", "Nearby Pharmacies")}</h2>
                        <p>
                            {t("nearbyPharmaciesHeroDesc", "Discover licensed local pharmacies around your location. View inventory, contact details, and distance instantly.")}
                        </p>
                    </div>
                </div>

                {/* Location Error Alert */}
                {locationError && (
                    <div className="location-error-card">
                        <AlertTriangle size={24} className="error-icon" />
                        <div className="error-text">
                            <strong>{t("locationPermissionRequired", "Location Permission Required")}</strong>
                            <p>{t(locationError)}</p>
                        </div>
                        <button
                            type="button"
                            className="retry-location-btn"
                            onClick={detectLocation}
                        >
                            {t("retryLocation", "Retry Location")}
                        </button>
                    </div>
                )}

                {/* Location Detected Status */}
                {location.latitude !== null && location.longitude !== null && (
                    <div className="location-detected-bar">
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>{t("gpsActive", "GPS Location Active")}</span>
                    </div>
                )}

                {/* Search & Filters */}
                <div className="search-section-wrapper">
                    <PharmacySearch
                        search={search}
                        setSearch={setSearch}
                        radius={radius}
                        handleRadiusChange={handleRadiusChange}
                        onUseLocation={detectLocation}
                    />
                </div>

                {/* Status Bar */}
                <div className="results-status-bar">
                    <div className="status-info">
                        <Sparkles size={16} className="sparkle-icon" />
                        <span className="results-count">
                            {t("showing", "Showing")} <strong>{filteredPharmacies.length}</strong> {filteredPharmacies.length === 1 ? t("pharmacy_single", "pharmacy") : t("pharmacies_plural", "pharmacies")}
                            {radius && radius !== "all" ? ` ${t("within", "within")} ${radius} KM` : ` (${t("allPharmacies", "All Pharmacies")})`}
                        </span>
                    </div>

                    <div className="status-actions">
                        {radius !== "all" && (
                            <button
                                type="button"
                                className="show-all-btn"
                                onClick={handleShowAll}
                            >
                                <Store size={14} />
                                {t("showAllPharmacies", "Show All Pharmacies")}
                            </button>
                        )}

                        {search && (
                            <button
                                type="button"
                                className="clear-all-filters-link"
                                onClick={() => setSearch("")}
                            >
                                <FilterX size={14} />
                                {t("clearSearch", "Clear Search")}
                            </button>
                        )}
                    </div>
                </div>

                {/* Pharmacy Grid */}
                <div className="pharmacy-grid-container">
                    {loading ? (
                        <div className="pharmacy-loading-state">
                            <Loader2 size={36} className="loading-spinner" />
                            <p>{t("locatingPharmacies", "Locating pharmacies near you...")}</p>
                        </div>
                    ) : filteredPharmacies.length > 0 ? (
                        <div className="pharmacy-grid">
                            {filteredPharmacies.map((shop) => (
                                <div className="pharmacy-card" key={shop.id}>
                                    <div className="pharmacy-card-image-wrapper">
                                        <img
                                            src={
                                                shop.shop_photo
                                                    ? `http://localhost:5000/uploads/shop_photos/${shop.shop_photo}`
                                                    : "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80"
                                            }
                                            alt={shop.shop_name || t("pharmacy_single", "pharmacy")}
                                            className="pharmacy-card-image"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80";
                                            }}
                                        />

                                        {shop.distance !== undefined && shop.distance !== null ? (
                                            <span className="distance-badge">
                                                <MapPin size={12} />
                                                <span>{shop.distance} {t("kmAway", "KM Away")}</span>
                                            </span>
                                        ) : (
                                            <span className="distance-badge distance-badge-city">
                                                <MapPin size={12} />
                                                <span>{shop.city || t("registeredPharmacy", "Registered Pharmacy")}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="pharmacy-card-content">
                                        <h3 className="pharmacy-title">
                                            {shop.shop_name || t("pharmacy_single", "pharmacy")}
                                        </h3>

                                        <div className="pharmacy-details-list">
                                            <div className="detail-item">
                                                <User size={15} className="detail-icon" />
                                                <span>{t("owner", "Owner")}: <strong>{shop.owner_name || "N/A"}</strong></span>
                                            </div>

                                            <div className="detail-item">
                                                <Phone size={15} className="detail-icon" />
                                                <span>{t("contact", "Contact")}: <strong>{shop.mobile || "N/A"}</strong></span>
                                            </div>

                                            <div className="detail-item">
                                                <MapPin size={15} className="detail-icon" />
                                                <span className="address-text" title={shop.address}>
                                                    {shop.address || "N/A"} {shop.city ? `, ${shop.city}` : ""}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="view-medicines-btn"
                                            onClick={() => navigate(`/customer/pharmacy/${shop.id}`)}
                                        >
                                            <ShoppingBag size={16} />
                                            <span>{t("viewMedicines", "View Medicines")}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pharmacies-empty-state">
                            <Store size={44} className="empty-icon" />
                            <h3>{t("noNearbyPharmacies", "No Nearby Pharmacies Found")}</h3>
                            <p>
                                {radius !== "all"
                                    ? t("noNearbyPharmaciesDesc", "We couldn't find any registered pharmacies within {{radius}} KM. Try increasing the search radius or clearing search filters.", { radius })
                                    : t("noPharmaciesRegistered", "No approved pharmacies found at this time.")}
                            </p>
                            {radius !== "all" && (
                                <button
                                    type="button"
                                    className="show-all-pharmacies-btn"
                                    onClick={handleShowAll}
                                >
                                    <Sparkles size={16} />
                                    <span>{t("showAllPharmacies", "Show All Pharmacies")}</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}

export default NearbyPharmacies;