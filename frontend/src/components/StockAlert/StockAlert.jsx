import { useEffect, useState } from "react";
import { AlertTriangle, XCircle } from "lucide-react";

import { getLowStock } from "../../api/dashboardApi";

import "./StockAlert.css";

function StockAlert({ vendorId }) {

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {

        loadLowStock();

    }, [vendorId]);

    const loadLowStock = async () => {

        try {

            const res = await getLowStock(vendorId);

            setMedicines(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="stock-alert">

            <div className="stock-header">

                <h3>Stock Alerts</h3>

            </div>

            {

                medicines.length === 0 ?

                    (

                        <div
                            style={{
                                padding: "20px",
                                textAlign: "center"
                            }}
                        >

                            No Low Stock Medicines

                        </div>

                    )

                    :

                    medicines.map((item) => (

                        <div
                            className="stock-item"
                            key={item.id}
                        >

                            <div>

                                <h4>{item.name}</h4>

                                <small>

                                    Stock : {item.stock}

                                </small>

                            </div>

                            <div
                                className={
                                    item.stock === 0
                                        ? "danger"
                                        : "warning"
                                }
                            >

                                {

                                    item.stock === 0 ?

                                        <XCircle size={18} />

                                        :

                                        <AlertTriangle size={18} />

                                }

                                <span>

                                    {

                                        item.stock === 0

                                            ? "Out Of Stock"

                                            : "Low Stock"

                                    }

                                </span>

                            </div>

                        </div>

                    ))

            }

        </div>

    );

}

export default StockAlert;