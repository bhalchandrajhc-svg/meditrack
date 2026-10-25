import { useTranslation } from "react-i18next";
import "./MedicineTable.css";
import StatusBadge from "./StatusBadge";
import ToggleSwitch from "../Common/ToggleSwitch";

import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

function MedicineTable({

    medicines,

    toggleVisibility,

    onView,

    onEdit,

    onDelete

}) {

    const { t } = useTranslation();

    return (

        <div className="medicine-table">

            <table>

                <thead>

                    <tr>

                        <th>{t("image")}</th>
                        <th>{t("medicine")}</th>
                        <th>{t("Company")}</th>
                        <th>{t("Category")}</th>
                        <th>{t("Price")}</th>
                        <th>{t("Stock")}</th>
                        <th>{t("status")}</th>
                        <th>{t("Visibility")}</th>
                        <th>{t("Action")}</th>

                    </tr>

                </thead>

                <tbody>

                    {medicines.length === 0 ? (

                        <tr>

                            <td
                                colSpan="9"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >
                                {t("noMedicinesFound")}
                            </td>

                        </tr>

                    ) : (

                        medicines.map((medicine) => (

                            <tr key={medicine.id}>

                                <td>

                                    <img
                                        src={`http://localhost:5000/uploads/medicines/${medicine.image}`}
                                        alt={medicine.name}
                                        className="medicine-image"
                                    />

                                </td>

                                <td><strong>{medicine.name}</strong></td>

                                <td>{medicine.company}</td>

                                <td>{medicine.category}</td>

                                <td>₹ {medicine.price}</td>

                                <td>{medicine.stock}</td>

                                <td>

                                    <StatusBadge
                                        status={medicine.status}
                                    />

                                </td>

                                <td>

                                    <ToggleSwitch
                                        checked={medicine.visible}
                                        onChange={() =>
                                            toggleVisibility(medicine.id)
                                        }
                                    />

                                </td>

                                <td>

                                    <div className="action-btns">

                                        <Eye
                                            size={18}
                                            onClick={() => onView(medicine)}
                                            style={{ cursor: "pointer", color: "#2563eb" }}
                                            title={t("view")}
                                        />

                                        <Pencil
                                            size={18}
                                            onClick={() => onEdit(medicine)}
                                            style={{ cursor: "pointer", color: "#10b981" }}
                                            title={t("editProfile")}
                                        />

                                        <Trash2
                                            size={18}
                                            onClick={() => onDelete(medicine.id)}
                                            style={{ cursor: "pointer", color: "#ef4444" }}
                                            title={t("delete")}
                                        />
                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default MedicineTable;