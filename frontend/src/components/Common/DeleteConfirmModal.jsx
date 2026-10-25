import "./DeleteConfirmModal.css";

function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Medicine",
    message = "Are you sure you want to delete this medicine?"
}) {

    if (!isOpen) return null;

    return (

        <div className="delete-overlay">

            <div className="delete-modal">

                <div className="delete-icon">
                    🗑️
                </div>

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="delete-actions">

                    <button
                        className="cancel-delete"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteConfirmModal;