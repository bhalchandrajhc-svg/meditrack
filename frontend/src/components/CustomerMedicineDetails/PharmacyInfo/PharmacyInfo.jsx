import { useState, useEffect, useCallback } from "react";
import {
    Building2,
    Phone,
    MapPin,
    Navigation,
    Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./PharmacyInfo.css";

function calculateDistance(lat1, lon1, lat2, lon2) {
    const p1 = parseFloat(lat1);
    const p2 = parseFloat(lon1);
    const p3 = parseFloat(lat2);
    const p4 = parseFloat(lon2);
    if (isNaN(p1) || isNaN(p2) || isNaN(p3) || isNaN(p4)) return null;

    const R = 6371; // Earth's radius in KM
    const dLat = ((p3 - p1) * Math.PI) / 180;
    const dLon = ((p4 - p2) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1 * Math.PI) / 180) *
        Math.cos((p3 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10;
}

function PharmacyInfo({ medicine }) {
    const { t } = useTranslation();

    const [distance, setDistance] = useState(
        medicine?.distance !== undefined && medicine?.distance !== null
            ? Number(medicine.distance)
            : null
    );
    const [gpsStatus, setGpsStatus] = useState(
        medicine?.distance !== undefined && medicine?.distance !== null
            ? "ready"
            : "detecting"
    );

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            if (medicine?.distance !== undefined && medicine?.distance !== null) {
                setDistance(Number(medicine.distance));
                setGpsStatus("ready");
            } else {
                setGpsStatus("unavailable");
            }
            return;
        }

        setGpsStatus("detecting");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const uLat = pos.coords.latitude;
                const uLng = pos.coords.longitude;
                if (medicine?.latitude && medicine?.longitude) {
                    const dist = calculateDistance(
                        uLat,
                        uLng,
                        medicine.latitude,
                        medicine.longitude
                    );
                    setDistance(dist);
                }
                setGpsStatus("ready");
            },
            (err) => {
                console.warn("GPS error:", err);
                if (medicine?.distance !== undefined && medicine?.distance !== null) {
                    setDistance(Number(medicine.distance));
                    setGpsStatus("ready");
                } else {
                    setGpsStatus("denied");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }, [medicine?.latitude, medicine?.longitude, medicine?.distance]);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    const formattedLocation = [
        medicine?.address,
        medicine?.city,
        medicine?.state,
        medicine?.pincode
    ]
        .map((item) => (item ? String(item).trim() : ""))
        .filter(Boolean)
        .join(", ");

    const displayLocation =
        formattedLocation ||
        medicine?.city ||
        medicine?.address ||
        t("locationNotAvailable", "Location details not available");

    const openDirections = () => {
        if (medicine?.latitude && medicine?.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${medicine.latitude},${medicine.longitude}`,
                "_blank"
            );
        } else {
            const query = [medicine?.shop_name, formattedLocation]
                .filter(Boolean)
                .join(", ");
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    query || "pharmacy"
                )}`,
                "_blank"
            );
        }
    };

    return (
        <div className="pharmacy-info-card">
            <h2>{t("availableAt", "Available At")}</h2>

            <div className="info-row">
                <Building2 size={18} className="pharmacy-icon" />
                <span className="info-text shop-name-text">
                    {medicine?.shop_name || t("pharmacy_single", "Pharmacy")}
                </span>
            </div>

            {medicine?.mobile && (
                <div className="info-row">
                    <Phone size={18} className="pharmacy-icon" />
                    <span className="info-text">{medicine.mobile}</span>
                </div>
            )}

            <div className="info-row">
                <MapPin size={18} className="pharmacy-icon" />
                <span className="info-text pharmacy-location-text">
                    {displayLocation}
                </span>
            </div>

            <div className="info-row distance-row">
                <Navigation
                    size={18}
                    className={`pharmacy-icon ${
                        distance !== null
                            ? "distance-active"
                            : gpsStatus === "detecting"
                            ? "distance-pulsing"
                            : ""
                    }`}
                />
                {distance !== null ? (
                    <span className="distance-badge-text">
                        <strong className="distance-value">{distance} KM</strong>{" "}
                        {t("kmAway", "KM Away")}
                    </span>
                ) : gpsStatus === "detecting" ? (
                    <span className="distance-loading-text">
                        <Loader2 size={15} className="spinner-inline" />
                        {t("calculatingDistance", "Calculating distance via GPS...")}
                    </span>
                ) : gpsStatus === "denied" ? (
                    <span className="distance-error-text">
                        {t("enableGpsToSeeDistance", "Enable GPS to view distance")}
                        <button
                            type="button"
                            className="retry-gps-btn"
                            onClick={detectLocation}
                        >
                            {t("retryLocation", "Retry Location")}
                        </button>
                    </span>
                ) : (
                    <span className="distance-na-text">
                        {t("distanceNotAvailable", "Distance not available")}
                    </span>
                )}
            </div>

            <div className="btn-group">
                {medicine?.mobile && (
                    <button
                        type="button"
                        onClick={() =>
                            (window.location.href = `tel:${medicine.mobile}`)
                        }
                    >
                        {t("callPharmacy", "Call Pharmacy")}
                    </button>
                )}

                <button
                    type="button"
                    className="direction"
                    onClick={openDirections}
                >
                    {t("getDirections", "Get Directions")}
                </button>
            </div>
        </div>
    );
}

export default PharmacyInfo;