import {
    Store,
    Eye,
    ShoppingCart,
    Pill,
    CheckCircle,
    XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MedicineCard.css";

function MedicineCard({ medicine }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const inStock = medicine?.stock > 0;

    const handleReserve = (e) => {
        e.stopPropagation();
        navigate(`/customer/medicine/${medicine.id}`);
    };

    const handleCardClick = () => {
        navigate(`/customer/medicine/${medicine.id}`);
    };

    return (
        <div className="medicine-card" onClick={handleCardClick}>
            <div className="medicine-image-wrapper">
                <img
                    src={
                        medicine?.image
                            ? `http://localhost:5000/uploads/medicines/${medicine.image}`
                            : "https://placehold.co/500x500/e2e8f0/1e293b?text=Medicine"
                    }
                    alt={medicine?.name || "Medicine"}
                    className="medicine-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/500x500/e2e8f0/1e293b?text=Medicine";
                    }}
                />

                <span className="medicine-category-badge">
                    <Pill size={13} />
                    {medicine?.category || t("medicineFallback", "Medicine")}
                </span>

                <span className={`stock-status-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
                    {inStock ? (
                        <>
                            <CheckCircle size={12} />
                            {t("inStockWithCount", "In Stock ({{count}})", { count: medicine.stock })}
                        </>
                    ) : (
                        <>
                            <XCircle size={12} />
                            {t("outOfStock", "Out of Stock")}
                        </>
                    )}
                </span>
            </div>

            <div className="medicine-content">
                <div className="medicine-header-info">
                    <h3 className="medicine-title" title={medicine?.name}>
                        {medicine?.name}
                    </h3>
                    <p className="medicine-company">
                        {medicine?.company || t("generic", "Generic")}
                    </p>
                </div>

                <div className="pharmacy-info">
                    <Store size={15} className="pharmacy-icon" />
                    <span className="pharmacy-name">
                        {medicine?.shop_name || medicine?.vendor_name || t("localPharmacy", "Local Pharmacy")}
                    </span>
                </div>

                <div className="medicine-footer">
                    <div className="price-tag">
                        <span className="currency">₹</span>
                        <span className="price-amount">{medicine?.price || "0"}</span>
                    </div>

                    <div className="card-actions">
                        <button
                            type="button"
                            className="action-btn view-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick();
                            }}
                            title={t("viewDetails", "View Details")}
                        >
                            <Eye size={16} />
                            <span>{t("view", "View")}</span>
                        </button>

                        <button
                            type="button"
                            className="action-btn reserve-btn"
                            disabled={!inStock}
                            onClick={handleReserve}
                            title={inStock ? t("reserveMedicine", "Reserve Medicine") : t("currentlyOutOfStock", "Currently Out of Stock")}
                        >
                            <ShoppingCart size={16} />
                            <span>{t("reserve", "Reserve")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicineCard;