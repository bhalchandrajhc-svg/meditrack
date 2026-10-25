import { useTranslation } from "react-i18next";
import "./SaveSettings.css";
import { toast } from "react-toastify";
import { useNotification } from "../../context/NotificationContext";
import { createNotification } from "../../api/notificationApi";

function SaveSettings({ onSave }) {

    const { t } = useTranslation();
    const { addNotification } = useNotification();

    const saveSettings = async () => {

        try {

            await onSave();

            await createNotification({

                vendor_id: 1,
                title: "Settings Updated",
                message: "Vendor profile updated successfully.",
                type: "success"

            });

            addNotification({

                title: "Settings Updated",
                message: "Vendor profile updated successfully.",
                type: "success"

            });

            toast.success("Settings Saved Successfully");

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to save settings");

        }

    };

    return (

        <div className="save-settings">

            <button
                className="save-btn"
                onClick={saveSettings}
            >
                {t("Save Changes")}
            </button>

        </div>

    );

}

export default SaveSettings;