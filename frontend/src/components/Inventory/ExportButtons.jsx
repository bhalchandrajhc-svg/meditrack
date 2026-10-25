import "./ExportButtons.css";

import { exportInventoryCSV } from "../../utils/exportCSV";
import { exportInventoryPDF } from "../../utils/exportPDF";

function ExportButtons({ medicines }) {

    return (

        <div className="export-buttons">

            <button
                className="csv-btn"
                onClick={() =>
                    exportInventoryCSV(medicines)
                }
            >
                Export CSV
            </button>

            <button
                className="pdf-btn"
                onClick={() =>
                    exportInventoryPDF(medicines)
                }
            >
                Export PDF
            </button>

        </div>

    );

}

export default ExportButtons;