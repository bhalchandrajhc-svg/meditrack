import { useTranslation } from "react-i18next";
import "./MedicineImage.css";

function MedicineImage({ medicine }) {
    const { t } = useTranslation();

    return (

        <div className="medicine-image-card">

            <img
                src={
                    medicine?.image
                        ? `http://localhost:5000/uploads/medicines/${medicine.image}`
                        : "https://placehold.co/500x500?text=Medicine"
                }
                alt={medicine?.name || t("medicineFallback", "Medicine")}
            />

        </div>

    );

}

export default MedicineImage;