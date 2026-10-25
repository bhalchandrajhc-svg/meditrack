import { Edit3, Check, X, Key } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ProfileActions.css";

function ProfileActions({ editing, setEditing, handleSave, loadProfile }) {
    const { t } = useTranslation();
    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = async () => {
        await loadProfile();
        setEditing(false);
    };

    const saveChanges = async () => {
        await handleSave();
    };

    return (
        <div className="profile-actions-wrapper">
            {editing ? (
                <>
                    <button
                        type="button"
                        className="save-btn"
                        onClick={saveChanges}
                    >
                        <Check size={16} />
                        <span>{t("saveChanges", "Save Changes")}</span>
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        <X size={16} />
                        <span>{t("cancel", "Cancel")}</span>
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        className="edit-btn"
                        onClick={handleEdit}
                    >
                        <Edit3 size={16} />
                        <span>{t("editProfile", "Edit Profile")}</span>
                    </button>

                    <button
                        type="button"
                        className="password-btn"
                        onClick={() => alert(t("passwordResetSent", "Password reset link sent to your registered email."))}
                    >
                        <Key size={16} />
                        <span>{t("changePassword", "Change Password")}</span>
                    </button>
                </>
            )}
        </div>
    );
}

export default ProfileActions;