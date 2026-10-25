import { useTranslation } from "react-i18next";
import "./MedicineInfo.css";

function MedicineInfo({ medicine }) {
    const { t } = useTranslation();

    return (

        <div className="medicine-info-card">

            <h2>

                {medicine?.name}

            </h2>

            <span className="company">

                {medicine?.company}

            </span>

            <div className="badge-row">

                <span className="badge">

                    {medicine?.category}

                </span>

                <span className="badge stock">

                    {medicine?.status}

                </span>

            </div>

            <h1 className="price">

                ₹{medicine?.price}

            </h1>

            <div className="description">

                <h3>{t("description", "Description")}</h3>

                <p>

                    {

                        medicine?.description ||

                        t("noDescription", "No description available.")

                    }

                </p>

            </div>

        </div>

    );

}

export default MedicineInfo;