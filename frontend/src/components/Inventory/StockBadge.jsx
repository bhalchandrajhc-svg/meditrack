import "./InventoryTable.css";

function StockBadge({ stock }) {

    let text = "";
    let className = "";

    if (stock === 0) {

        text = "Out Of Stock";
        className = "out-stock";

    } else if (stock <= 10) {

        text = "Low Stock";
        className = "low-stock";

    } else {

        text = "In Stock";
        className = "in-stock";

    }

    return (

        <span className={`stock-badge ${className}`}>
            {text}
        </span>

    );

}

export default StockBadge;