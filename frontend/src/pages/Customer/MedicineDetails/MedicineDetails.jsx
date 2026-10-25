import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";

import MedicineImage from "../../../components/CustomerMedicineDetails/MedicineImage/MedicineImage";
import MedicineInfo from "../../../components/CustomerMedicineDetails/MedicineInfo/MedicineInfo";
import PharmacyInfo from "../../../components/CustomerMedicineDetails/PharmacyInfo/PharmacyInfo";
import ReserveCard from "../../../components/CustomerMedicineDetails/ReserveCard/ReserveCard";

import { getMedicineById } from "../../../services/customerService";

import { useTranslation } from "react-i18next";

import "./MedicineDetails.css";

function MedicineDetails() {

    const { t } = useTranslation();

    const { id } = useParams();

    const navigate = useNavigate();

    const [medicine, setMedicine] = useState(null);

    useEffect(() => {

        loadMedicine();

    }, [id]);

    const loadMedicine = async () => {

        try {

            const res = await getMedicineById(id);

            setMedicine(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    if (!medicine) {

        return (

            <CustomerLayout>

                <h2 style={{ padding: "30px" }}>
                    {t("loading", "Loading...")}
                </h2>

            </CustomerLayout>

        );

    }

    return (

        <CustomerLayout>

            <div className="medicine-details-page">

                <div className="details-header">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >

                        ← {t("back", "Back")}

                    </button>

                </div>

                <div className="details-grid">

                    <MedicineImage medicine={medicine} />

                    <MedicineInfo medicine={medicine} />

                    <ReserveCard medicine={medicine} />

                </div>

                <PharmacyInfo medicine={medicine} />

            </div>

        </CustomerLayout>

    );

}

export default MedicineDetails;