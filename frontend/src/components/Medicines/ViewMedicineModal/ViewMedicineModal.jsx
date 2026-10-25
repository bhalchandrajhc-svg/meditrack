import "./ViewMedicineModal.css";

function ViewMedicineModal({

    isOpen,
    onClose,
    medicine

}) {

    if (!isOpen || !medicine) return null;

    return (

        <div className="view-overlay">

            <div className="view-modal">

                <div className="view-header">

                    <h3>Medicine Details</h3>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕

                    </button>

                </div>

                <div className="view-body">

                    <div className="medicine-image">

                        <img
                            src={`http://localhost:5000/uploads/medicines/${medicine.image}`}
                            alt={medicine.name}
                        />

                    </div>

                    <div className="medicine-details">

                        <div className="detail-row">
                            <span>Name</span>
                            <strong>{medicine.name}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Company</span>
                            <strong>{medicine.company}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Category</span>
                            <strong>{medicine.category}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Price</span>
                            <strong>{medicine.price}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Stock</span>
                            <strong>{medicine.stock}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Status</span>
                            <strong>{medicine.status}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Visibility</span>

                            <strong>

                                {medicine.visible ? "Visible" : "Hidden"}

                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ViewMedicineModal;