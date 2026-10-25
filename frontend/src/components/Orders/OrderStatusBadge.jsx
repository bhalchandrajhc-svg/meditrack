import { useTranslation } from "react-i18next";
import "./OrderStatusBadge.css";

function OrderStatusBadge({ status }) {

    const { t } = useTranslation();

    const translatedStatus = (() => {
        if (!status) return "Pending";
        if (status === "Pending") return t("pending");
        if (status === "Accepted") return t("accepted");
        if (status === "Rejected" || status === "Cancelled") return t("cancelled");
        if (status === "Ready for Pickup" || status === "Ready") return t("readyPickup");
        if (status === "Completed") return t("completed");
        return t(status) || status;
    })();

    return (

        <span className={`order-status ${(status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>

            {translatedStatus}

        </span>

    );

}

export default OrderStatusBadge;