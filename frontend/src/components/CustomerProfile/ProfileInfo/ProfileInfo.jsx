import {
    Phone,
    User,
    Calendar,
    Droplet,
    MapPin,
    Building,
    Compass,
    Hash
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ProfileInfo.css";

function ProfileInfo({ profile, editing, handleChange }) {
    const { t } = useTranslation();
    const formatDate = (date) => {
        if (!date) return "";
        try {
            return new Date(date).toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    return (
        <div className="profile-info-card">
            <div className="section-title-row">
                <h3>{t("personalContactDetails", "Personal & Contact Details")}</h3>
                <span className="mode-badge">{editing ? t("editingMode", "Editing Mode") : t("viewMode", "View Mode")}</span>
            </div>

            <div className="info-grid">
                {/* Mobile Number */}
                <div className="info-field-box">
                    <label>
                        <Phone size={15} className="field-icon" />
                        <span>{t("mobileNumber", "Mobile Number")}</span>
                    </label>
                    <input
                        type="text"
                        name="mobile"
                        value={profile?.mobile || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={t("enterMobile", "Enter mobile number")}
                    />
                </div>

                {/* Gender */}
                <div className="info-field-box">
                    <label>
                        <User size={15} className="field-icon" />
                        <span>{t("gender", "Gender")}</span>
                    </label>
                    {editing ? (
                        <select
                            name="gender"
                            value={profile?.gender || ""}
                            onChange={handleChange}
                            className="field-select"
                        >
                            <option value="">{t("selectGender", "Select Gender")}</option>
                            <option value="Male">{t("male", "Male")}</option>
                            <option value="Female">{t("female", "Female")}</option>
                            <option value="Other">{t("other", "Other")}</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={profile?.gender || t("notSpecified", "Not Specified")}
                            disabled
                        />
                    )}
                </div>

                {/* Date of Birth */}
                <div className="info-field-box">
                    <label>
                        <Calendar size={15} className="field-icon" />
                        <span>{t("dateOfBirth", "Date of Birth")}</span>
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formatDate(profile?.dob)}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </div>

                {/* Blood Group */}
                <div className="info-field-box">
                    <label>
                        <Droplet size={15} className="field-icon" />
                        <span>{t("bloodGroup", "Blood Group")}</span>
                    </label>
                    {editing ? (
                        <select
                            name="blood_group"
                            value={profile?.blood_group || ""}
                            onChange={handleChange}
                            className="field-select"
                        >
                            <option value="">{t("selectBloodGroup", "Select Blood Group")}</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={profile?.blood_group || t("notSpecified", "Not Specified")}
                            disabled
                        />
                    )}
                </div>

                {/* Address (Full Row) */}
                <div className="info-field-box full-width">
                    <label>
                        <MapPin size={15} className="field-icon" />
                        <span>{t("address", "Address")}</span>
                    </label>
                    <textarea
                        name="address"
                        value={profile?.address || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={t("enterAddress", "Enter full street address")}
                        rows="3"
                    />
                </div>

                {/* City */}
                <div className="info-field-box">
                    <label>
                        <Building size={15} className="field-icon" />
                        <span>{t("city", "City")}</span>
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={profile?.city || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={t("enterCity", "Enter city")}
                    />
                </div>

                {/* State */}
                <div className="info-field-box">
                    <label>
                        <Compass size={15} className="field-icon" />
                        <span>{t("state", "State")}</span>
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={profile?.state || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={t("enterState", "Enter state")}
                    />
                </div>

                {/* Pincode */}
                <div className="info-field-box">
                    <label>
                        <Hash size={15} className="field-icon" />
                        <span>{t("pincode", "Pincode")}</span>
                    </label>
                    <input
                        type="text"
                        name="pincode"
                        value={profile?.pincode || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={t("enterPincode", "6-digit pincode")}
                        maxLength="6"
                    />
                </div>
            </div>
        </div>
    );
}

export default ProfileInfo;