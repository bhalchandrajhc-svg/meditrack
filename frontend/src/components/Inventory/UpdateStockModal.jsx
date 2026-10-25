import { useEffect, useState } from "react";
import "./UpdateStockModal.css";

function UpdateStockModal({

    isOpen,
    onClose,
    medicine,
    onSave

}) {

    const [type, setType] = useState("add");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("Purchase");

    useEffect(() => {

        if (isOpen) {

            setType("add");
            setQuantity("");
            setReason("Purchase");

        }

    }, [isOpen]);

    if (!isOpen || !medicine) return null;

    const handleSave = () => {

        if (!quantity || Number(quantity) <= 0) {

            alert("Enter valid quantity");

            return;

        }

        onSave({

            medicineId: medicine.id,

            type,

            quantity: Number(quantity),

            reason

        });

    };

    return (

        <div className="modal-overlay">

            <div className="stock-modal">

                <h2>Update Stock</h2>

                <div className="stock-info">

                    <label>Medicine</label>

                    <input
                        value={medicine.name}
                        disabled
                    />

                </div>

                <div className="stock-info">

                    <label>Current Stock</label>

                    <input
                        value={medicine.stock}
                        disabled
                    />

                </div>

                <div className="stock-info">

                    <label>Update Type</label>

                    <select

                        value={type}

                        onChange={(e)=>setType(e.target.value)}

                    >

                        <option value="add">

                            Add Stock

                        </option>

                        <option value="reduce">

                            Reduce Stock

                        </option>

                    </select>

                </div>

                <div className="stock-info">

                    <label>Quantity</label>

                    <input

                        type="number"

                        value={quantity}

                        onChange={(e)=>setQuantity(e.target.value)}

                    />

                </div>

                <div className="stock-info">

                    <label>Reason</label>

                    <select

                        value={reason}

                        onChange={(e)=>setReason(e.target.value)}

                    >

                        <option>Purchase</option>

                        <option>Return</option>

                        <option>Damaged</option>

                        <option>Expired</option>

                        <option>Adjustment</option>

                    </select>

                </div>

                <div className="modal-buttons">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={handleSave}

                    >

                        Update Stock

                    </button>

                </div>

            </div>

        </div>

    );

}

export default UpdateStockModal;