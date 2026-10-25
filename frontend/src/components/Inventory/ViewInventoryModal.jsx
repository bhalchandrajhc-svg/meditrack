import "./ViewInventoryModal.css";

function ViewInventoryModal({

    isOpen,

    onClose,

    medicine

}) {

    if (!isOpen || !medicine) return null;

    return (

        <div className="modal-overlay">

            <div className="view-modal">

                <h2>Medicine Details</h2>

                <img

                    src={medicine.image}

                    alt={medicine.name}

                    className="view-image"

                />

                <div className="view-info">

                    <p>

                        <strong>Name :</strong>

                        {medicine.name}

                    </p>

                    <p>

                        <strong>Company :</strong>

                        {medicine.company}

                    </p>

                    <p>

                        <strong>Category :</strong>

                        {medicine.category}

                    </p>

                    <p>

                        <strong>Price :</strong>

                        {medicine.price}

                    </p>

                    <p>

                        <strong>Stock :</strong>

                        {medicine.stock}

                    </p>

                    <p>

                        <strong>Status :</strong>

                        {medicine.status}

                    </p>

                </div>

                <button

                    className="close-btn"

                    onClick={onClose}

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default ViewInventoryModal;