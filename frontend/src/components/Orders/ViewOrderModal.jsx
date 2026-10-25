import "./ViewOrderModal.css";

function ViewOrderModal({
    isOpen,
    onClose,
    order,
}) {

    if (!isOpen || !order) return null;

    return (

        <div className="view-order-overlay">

            <div className="view-order-modal">

                <div className="view-order-header">

                    <h2>Order #{order.id}</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="view-order-body">

                    <div className="detail-row">
                        <strong>Customer :</strong>
                        <span>{order.customer_name}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Shop :</strong>
                        <span>{order.shop_name}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Medicine :</strong>
                        <span>{order.medicine_name}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Quantity :</strong>
                        <span>{order.quantity}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Total :</strong>
                        <span>₹{order.total_amount}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Status :</strong>
                        <span>{order.status}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Order Date :</strong>
                        <span>
                            {new Date(order.order_date).toLocaleString()}
                        </span>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default ViewOrderModal;