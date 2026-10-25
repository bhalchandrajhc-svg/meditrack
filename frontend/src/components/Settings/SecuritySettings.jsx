import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { changeVendorPassword } from "../../api/vendorApi";
import "./SecuritySettings.css";

function SecuritySettings({ vendorId }) {

    const { t } = useTranslation();

    const [passwords, setPasswords] = useState({

        current: "",

        newPassword: "",

        confirm: ""

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setPasswords((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    const handleChangePassword = async () => {

        if (

            !passwords.current ||

            !passwords.newPassword ||

            !passwords.confirm

        ) {

            toast.warning("Please fill all fields.");

            return;

        }

        if (passwords.newPassword !== passwords.confirm) {

            toast.error("Passwords do not match.");

            return;

        }

        try {

            await changeVendorPassword(vendorId, {

                currentPassword: passwords.current,

                newPassword: passwords.newPassword

            });

            toast.success("Password Changed Successfully");

            setPasswords({

                current: "",

                newPassword: "",

                confirm: ""

            });

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Failed to change password"

            );

        }

    };

    return (

        <div className="security-card">

            <h3>{t("Security Settings")}</h3>

            <div className="security-grid">

                <input

                    type="password"

                    name="current"

                    placeholder={t("Old Password")}

                    value={passwords.current}

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="newPassword"

                    placeholder={t("New Password")}

                    value={passwords.newPassword}

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="confirm"

                    placeholder={t("Confirm Password")}

                    value={passwords.confirm}

                    onChange={handleChange}

                />

            </div>

            <button

                className="change-password-btn"

                onClick={handleChangePassword}

            >

                {t("Change Password")}

            </button>

        </div>

    );

}

export default SecuritySettings;