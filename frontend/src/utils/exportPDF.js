import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportInventoryPDF(medicines) {

    const doc = new jsPDF();

    // ==========================
    // Header
    // ==========================

    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);

    doc.text("MEDI TRACK", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);

    doc.text("Inventory Report", 14, 28);

    doc.text(
        `Generated : ${new Date().toLocaleString()}`,
        14,
        35
    );

    // ==========================
    // Table
    // ==========================

    autoTable(doc, {

        startY: 45,

        head: [[

            "Medicine",
            "Company",
            "Category",
            "Price",
            "Stock",
            "Status"

        ]],

        body: medicines.map((item) => [

            item.name,

            item.company,

            item.category,

            item.price,

            item.stock,

            item.stock === 0
                ? "Out Of Stock"
                : item.stock <= 10
                ? "Low Stock"
                : "In Stock"

        ]),

        headStyles: {

            fillColor: [37, 99, 235],

        },

        styles: {

            fontSize: 10,

            cellPadding: 3,

        }

    });

    // ==========================
    // Footer
    // ==========================

    doc.save("Inventory_Report.pdf");

}