export function exportInventoryCSV(medicines) {

    const headers = [
        "Medicine",
        "Company",
        "Category",
        "Price",
        "Stock",
        "Status"
    ];

    const rows = medicines.map((item) => [

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

    ]);

    const csvContent = [

        headers.join(","),

        ...rows.map((e) => e.join(","))

    ].join("\n");

    const blob = new Blob(

        [csvContent],

        {
            type: "text/csv;charset=utf-8;"
        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Inventory_Report.csv";

    link.click();

}   