import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ReserveCard.css";
import { reserveMedicine } from "../../../services/orderService";
import { useNotification } from "../../../context/NotificationContext";

function ReserveCard({ medicine }) {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const { refreshApp } = useNotification();

    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleReserve = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));
            const customerId = user?.id || user?.user_id || user?._id;

            if (!user || !customerId) {

                alert(t("loginRequired", "Please login first as Customer."));
                navigate("/login");
                return;

            }

            if (quantity < 1) {

                alert(t("quantityMin", "Quantity must be at least 1."));
                return;

            }

            if (quantity > medicine.stock) {

                alert(t("quantityExceedsStock", "Requested quantity exceeds available stock."));
                return;

            }

            setLoading(true);

            const payload = {

                customer_id: customerId,
                medicine_id: medicine.id,
                quantity: Number(quantity)

            };

            const response = await reserveMedicine(payload);

            // 🔄 Refresh whole application
            refreshApp();

            alert(response.data.message);

            navigate("/customer/orders");

        }

        catch (err) {

            console.error("Reserve Error:", err);

            alert(

                err.response?.data?.message ||
                t("reservationFailed", "Reservation Failed")

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="reserve-card">

            <h2>{t("reserveMedicine", "Reserve Medicine")}</h2>

            <label>{t("quantity", "Quantity")}</label>

            <input
                type="number"
                min="1"
                max={medicine.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <div className="reserve-info">

                <p>
                    {t("availableStock", "Available Stock :")}
                    <strong> {medicine.stock}</strong>
                </p>

                <p>
                    {t("totalPrice", "Total Price :")}
                    <strong>
                        ₹ {(medicine.price * quantity).toFixed(2)}
                    </strong>
                </p>

            </div>

            <button
                type="button"
                onClick={handleReserve}
                disabled={loading || medicine.stock <= 0}
            >

                {
                    loading
                        ? t("processing", "Processing...")
                        : medicine.stock > 0
                            ? t("reserveMedicine", "Reserve Medicine")
                            : t("outOfStock", "Out of Stock")
                }

            </button>

        </div>

    );

}

export default ReserveCard;