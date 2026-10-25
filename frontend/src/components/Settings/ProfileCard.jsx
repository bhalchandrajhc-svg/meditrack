import { useRef } from "react";
import { useTranslation } from "react-i18next";
import "./ProfileCard.css";

function ProfileCard({ vendor, setVendor }) {

    const { t } = useTranslation();
    const fileRef = useRef(null);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setVendor((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setVendor((prev) => ({
            ...prev,
            shop_photo: file
        }));

    };

    const imageSrc =
        vendor.shop_photo instanceof File
            ? URL.createObjectURL(vendor.shop_photo)
            : vendor.shop_photo
            ? `http://localhost:5000/uploads/shop_photos/${vendor.shop_photo}`
            : "/logo.png";

    return (

        <div className="profile-card">

            <h3>{t("profile")}</h3>

            <div className="profile-content">

                <div className="profile-image">

                    <img
                        src={imageSrc}
                        alt="Shop"
                    />

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImage}
                    />

                    <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                    >
                        {t("editProfile")}
                    </button>

                </div>

                <div className="profile-form">

                    <input
                        type="text"
                        name="shop_name"
                        placeholder={t("Shop Name")}
                        value={vendor.shop_name || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="owner_name"
                        placeholder={t("Owner Name")}
                        value={vendor.owner_name || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder={t("Email Address")}
                        value={vendor.email || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="mobile"
                        placeholder={t("Phone Number")}
                        value={vendor.mobile || ""}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </div>

    );

}

export default ProfileCard;