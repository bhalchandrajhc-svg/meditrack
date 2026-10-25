import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import SearchBar from "../../../components/CustomerMedicines/SearchBar/SearchBar";
import CategoryFilter from "../../../components/CustomerMedicines/CategoryFilter/CategoryFilter";
import MedicineCard from "../../../components/CustomerMedicines/MedicineCard/MedicineCard";
import EmptyState from "../../../components/CustomerMedicines/EmptyState/EmptyState";
import { getMedicines } from "../../../services/customerService";
import { useNotification } from "../../../context/NotificationContext";
import socket from "../../../services/socket";
import { Pill, Sparkles, FilterX, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./FindMedicines.css";

function FindMedicines() {
    const { t } = useTranslation();
    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [nearMe, setNearMe] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [loading, setLoading] = useState(true);

    const { refreshKey } = useNotification();

    // ==========================
    // Load Medicines
    // ==========================
    const loadMedicines = useCallback(async (searchQuery = search) => {
        setLoading(true);
        try {
            const res = await getMedicines(searchQuery);
            setMedicines(res.data || []);
        } catch (err) {
            console.error("Error fetching medicines:", err);
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    }, [search]);

    // ==========================
    // Initial Load & Refresh
    // ==========================
    useEffect(() => {
        loadMedicines();
    }, [loadMedicines, refreshKey]);

    // ==========================
    // Socket Events
    // ==========================
    useEffect(() => {
        const handleRefresh = () => loadMedicines();

        socket.on("medicineUpdated", handleRefresh);
        socket.on("inventoryRefresh", handleRefresh);
        socket.on("dashboardRefresh", handleRefresh);
        socket.on("orderCreated", handleRefresh);

        return () => {
            socket.off("medicineUpdated", handleRefresh);
            socket.off("inventoryRefresh", handleRefresh);
            socket.off("dashboardRefresh", handleRefresh);
            socket.off("orderCreated", handleRefresh);
        };
    }, [loadMedicines]);

    // ==========================
    // Filtering & Sorting Logic
    // ==========================
    const filteredMedicines = useMemo(() => {
        let result = [...medicines];

        // 1. Filter by Category
        if (category !== "All") {
            result = result.filter(
                (med) => med.category?.toLowerCase() === category.toLowerCase()
            );
        }

        // 2. Filter by In Stock Only
        if (inStockOnly) {
            result = result.filter((med) => Number(med.stock) > 0);
        }

        // 3. Sorting
        if (sortBy === "price-low") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === "price-high") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === "name-asc") {
            result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }

        return result;
    }, [medicines, category, inStockOnly, sortBy]);

    // Reset all active filters
    const handleResetFilters = () => {
        setSearch("");
        setCategory("All");
        setNearMe(false);
        setInStockOnly(false);
        setSortBy("default");
        loadMedicines("");
    };

    const hasActiveFilters = Boolean(
        search || category !== "All" || inStockOnly || nearMe || sortBy !== "default"
    );

    return (
        <CustomerLayout>
            <div className="find-medicines-page">
                {/* Hero Header Section */}
                <div className="find-medicines-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Pill size={14} />
                            <span>{t("verifiedLocalNetwork", "Verified Local Pharmacy Network")}</span>
                        </div>
                        <h2>{t("findReserveMedicines", "Find & Reserve Medicines")}</h2>
                        <p>
                            {t("findMedicinesHeroDesc", "Search real-time inventory from registered local pharmacies. Check availability, compare prices, and reserve instantly.")}
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="search-section-wrapper">
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearch={loadMedicines}
                        nearMe={nearMe}
                        setNearMe={setNearMe}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />

                    <CategoryFilter
                        category={category}
                        setCategory={setCategory}
                    />
                </div>

                {/* Results Status Bar */}
                <div className="results-status-bar">
                    <div className="status-info">
                        <Sparkles size={16} className="sparkle-icon" />
                        <span className="results-count">
                            {t("showing", "Showing")} <strong>{filteredMedicines.length}</strong> {filteredMedicines.length === 1 ? t("medicine_single", "medicine") : t("medicines_plural", "medicines")}
                            {medicines.length > 0 && ` ${t("outOf", "out of")} ${medicines.length}`}
                        </span>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="clear-all-filters-link"
                            onClick={handleResetFilters}
                        >
                            <FilterX size={14} />
                            {t("clearAllFilters", "Clear All Filters")}
                        </button>
                    )}
                </div>

                {/* Medicine Grid */}
                <div className="medicine-grid">
                    {loading ? (
                        <div className="medicines-loading-state">
                            <Loader2 size={36} className="loading-spinner" />
                            <p>{t("loadingMedicines", "Loading medicines...")}</p>
                        </div>
                    ) : filteredMedicines.length > 0 ? (
                        filteredMedicines.map((medicine) => (
                            <MedicineCard
                                key={medicine.id}
                                medicine={medicine}
                            />
                        ))
                    ) : (
                        <EmptyState
                            search={search}
                            category={category}
                            inStockOnly={inStockOnly}
                            onReset={handleResetFilters}
                        />
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}

export default FindMedicines;