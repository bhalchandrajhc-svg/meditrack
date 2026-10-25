import { useState } from "react";
import "./AddMedicineModal.css";

function AddMedicineModal({
    isOpen,
    onClose,
    onSave
}) {
    const loggedVendor = JSON.parse(localStorage.getItem("vendor"));
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        category: "Tablet",
        price: "",
        stock: "",
        expiry: "",
        image: null
    });

    const [preview, setPreview] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            image: file
        }));

        setPreview(URL.createObjectURL(file));

    };

    const handleSave = () => {

        if (
            !formData.name ||
            !formData.company ||
            !formData.price ||
            !formData.stock
        ) {

            alert("Please fill all required fields.");

            return;

        }

        const data = new FormData();

        data.append("vendor_id", loggedVendor.id);
        data.append("name", formData.name);
        data.append("company", formData.company);
        data.append("category", formData.category);
        data.append("description", "");
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("status",
            Number(formData.stock) === 0
                ? "Out of Stock"
                : Number(formData.stock) <= 10
                    ? "Low Stock"
                    : "Available",
        );
        data.append("visible", 1);

        if (formData.image) {

            data.append("image", formData.image);

        }

        onSave(data);

        setFormData({
            name: "",
            company: "",
            category: "Tablet",
            price: "",
            stock: "",
            expiry: "",
            image: null
        });

        setPreview("");

        onClose();

    };

    return (

        <div className="medicine-overlay">

            <div className="medicine-modal">

                <div className="medicine-header">

                    <h3>Add New Medicine</h3>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="medicine-body">

                    <div className="form-grid">

                        <div className="form-group">

                            <label>Medicine Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter medicine name"
                            />

                        </div>

                        <div className="form-group">

                            <label>Company</label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                            />

                        </div>

                        <div className="form-group">

                            <label>Category</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >

                                <option>Tablet</option>
                                <option>Capsule</option>
                                <option>Syrup</option>
                                <option>Injection</option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Price</label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                            />

                        </div>

                        <div className="form-group">

                            <label>Stock</label>

                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Enter stock quantity"
                            />

                        </div>

                        <div className="form-group">

                            <label>Expiry Date</label>

                            <input
                                type="date"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>Medicine Image</label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />

                            {preview && (

                                <div className="image-preview">

                                    <img
                                        src={preview}
                                        alt="Preview"
                                    />

                                </div>

                            )}

                        </div>

                    </div>

                    <div className="medicine-footer">

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
                            Save Medicine
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AddMedicineModal;