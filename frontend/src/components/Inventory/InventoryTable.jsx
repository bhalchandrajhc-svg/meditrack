import { useTranslation } from "react-i18next";
import "./InventoryTable.css";

import StockBadge from "./StockBadge";

import {
    Eye,
    Pencil
} from "lucide-react";

function InventoryTable({

    medicines,

    onView,

    onUpdate

}) {

    const { t } = useTranslation();

    return (

        <div className="inventory-table">

            <table>

                <thead>

                    <tr>

                        <th>{t("image")}</th>

                        <th>{t("medicine")}</th>

                        <th>{t("Company")}</th>

                        <th>{t("Category")}</th>

                        <th>{t("Stock")}</th>

                        <th>{t("status")}</th>

                        <th>{t("Action")}</th>

                    </tr>

                </thead>

                <tbody>

                    {medicines.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                {t("noMedicinesFound")}
                            </td>
                        </tr>
                    ) : (
                        medicines.map((medicine)=>(

                            <tr key={medicine.id}>

                                <td>

                                    <img

                                        src={medicine.image ? (medicine.image.startsWith("http") ? medicine.image : `http://localhost:5000/uploads/medicines/${medicine.image}`) : "/logo.png"}

                                        className="medicine-image"

                                        alt={medicine.name}

                                    />

                                </td>

                                <td><strong>{medicine.name}</strong></td>

                                <td>{medicine.company}</td>

                                <td>{medicine.category}</td>

                                <td>{medicine.stock}</td>

                                <td>

                                    <StockBadge stock={medicine.stock}/>

                                </td>

                                <td>

                                    <div className="inventory-actions">

                                        <Eye

                                            size={18}

                                            onClick={()=>onView(medicine)}
                                            style={{ cursor: "pointer", color: "#2563eb" }}
                                            title={t("view")}

                                        />

                                        <Pencil

                                            size={18}

                                            onClick={()=>onUpdate(medicine)}
                                            style={{ cursor: "pointer", color: "#10b981" }}
                                            title={t("Update Stock")}

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

export default InventoryTable;