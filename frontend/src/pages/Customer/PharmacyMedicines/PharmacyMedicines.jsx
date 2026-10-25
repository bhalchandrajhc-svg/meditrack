import { useEffect, useState } from "react";
import {
    useParams,
    useNavigate
} from "react-router-dom";
import { API_BASE_URL } from "../../../config";

import CustomerLayout
    from "../../../layouts/CustomerLayout/CustomerLayout";

import {
    getVendorMedicines
} from "../../../services/customerService";

import { useTranslation } from "react-i18next";

import "./PharmacyMedicines.css";


function PharmacyMedicines() {

    const { t } = useTranslation();

    const { vendorId } = useParams();

    const navigate = useNavigate();


    // =============================
    // States
    // =============================

    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =============================
    // Load Vendor Medicines
    // =============================

    useEffect(() => {

        if (vendorId) {

            loadMedicines();

        }

    }, [vendorId]);


    const loadMedicines = async () => {

        try {

            setLoading(true);

            setError("");

            const res =
                await getVendorMedicines(vendorId);

            console.log(
                "Vendor Medicines:",
                res.data
            );

            setMedicines(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        }

        catch (err) {

            console.error(
                "Vendor Medicines Error:",
                err
            );

            setMedicines([]);

            setError(
                t("unableToLoadMedicines", "Unable to load medicines.")
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =============================
    // View Medicine
    // =============================

    const viewMedicine = (medicineId) => {

        navigate(
            `/customer/medicine/${medicineId}`
        );

    };


    // =============================
    // Render
    // =============================

    return (

        <CustomerLayout>

            <div className="vendor-medicines-page">

                {/* Header */}

                <div className="page-header">

                    <div>

                        <h2>
                            {t("availableMedicines", "Available Medicines")}
                        </h2>

                        <p>
                            {t("availableAtPharmacy", "Medicines available at this pharmacy.")}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() =>
                            navigate("/customer/pharmacies")
                        }
                    >
                        ← {t("back", "Back")}
                    </button>

                </div>


                {/* Loading */}

                {
                    loading ? (

                        <div className="medicine-empty">

                            <h3>
                                {t("loadingMedicines", "Loading medicines...")}
                            </h3>

                        </div>

                    ) : error ? (

                        <div className="medicine-empty">

                            <h3>
                                {error}
                            </h3>

                        </div>

                    ) : medicines.length === 0 ? (

                        <div className="medicine-empty">

                            <h3>
                                {t("noMedicinesFound", "No Medicines Found")}
                            </h3>

                            <p>
                                {t("noMedicinesAtPharmacy", "This pharmacy currently has no medicines available.")}
                            </p>

                        </div>

                    ) : (

                        <div className="medicine-grid">

                            {
                                medicines.map(
                                    (medicine) => (

                                        <div
                                            className="medicine-card"
                                            key={medicine.id}
                                        >

                                            {/* Image */}

                                            <img
                                                src={
                                                    medicine.image
                                                        ? `${API_BASE_URL}/uploads/medicines/${medicine.image}`
                                                        : "https://placehold.co/300x200?text=Medicine"
                                                }
                                                alt={
                                                    medicine.name ||
                                                    t("medicineFallback", "Medicine")
                                                }
                                                onError={(e) => {

                                                    e.currentTarget.onerror =
                                                        null;

                                                    e.currentTarget.src =
                                                        "https://placehold.co/300x200?text=Medicine";

                                                }}
                                            />


                                            {/* Name */}

                                            <h3>
                                                {medicine.name}
                                            </h3>


                                            {/* Company */}

                                            <p>

                                                <strong>
                                                    {t("company", "Company:")}
                                                </strong>

                                                {" "}

                                                {
                                                    medicine.company ||
                                                    "N/A"
                                                }

                                            </p>


                                            {/* Category */}

                                            <p>

                                                <strong>
                                                    {t("categoryLabel", "Category:")}
                                                </strong>

                                                {" "}

                                                {
                                                    medicine.category ||
                                                    "N/A"
                                                }

                                            </p>


                                            {/* Stock */}

                                            <p>

                                                <strong>
                                                    {t("stockLabel", "Stock:")}
                                                </strong>

                                                {" "}

                                                {medicine.stock}

                                            </p>


                                            {/* Price */}

                                            <h4>

                                                ₹
                                                {
                                                    Number(
                                                        medicine.price || 0
                                                    ).toFixed(2)
                                                }

                                            </h4>


                                            {/* Stock Status */}

                                            <div
                                                className={
                                                    medicine.stock > 0
                                                        ? "medicine-stock available"
                                                        : "medicine-stock unavailable"
                                                }
                                            >

                                                {
                                                    medicine.stock > 0
                                                        ? t("inStock", "In Stock")
                                                        : t("outOfStock", "Out of Stock")
                                                }

                                            </div>


                                            {/* Button */}

                                            <button
                                                type="button"
                                                disabled={
                                                    medicine.stock <= 0
                                                }
                                                onClick={() =>
                                                    viewMedicine(
                                                        medicine.id
                                                    )
                                                }
                                            >

                                                {
                                                    medicine.stock > 0
                                                        ? t("viewDetails", "View Details")
                                                        : t("outOfStock", "Out of Stock")
                                                }

                                            </button>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </div>

        </CustomerLayout>

    );

}

export default PharmacyMedicines;