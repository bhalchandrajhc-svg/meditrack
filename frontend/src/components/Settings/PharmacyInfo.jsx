import { useTranslation } from "react-i18next";
import "./PharmacyInfo.css";

function PharmacyInfo({ vendor, setVendor }) {

    const { t } = useTranslation();

    const handleChange = (e) => {

        const { name, value } = e.target;

        setVendor((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleLicensePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVendor((prev) => ({
            ...prev,
            license_photo: file
        }));
    };

    return (

        <div className="pharmacy-card">

            <h3>{t("Pharmacy Details")}</h3>

            <div className="pharmacy-grid">

                <input
                    type="text"
                    name="license_number"
                    placeholder={t("License Number")}
                    value={vendor.license_number || ""}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="vendor_legal_name"
                    placeholder={t("Owner Name") || "Official Legal Business Name"}
                    value={vendor.vendor_legal_name || ""}
                    onChange={handleChange}
                />

                <select
                    name="business_type"
                    value={vendor.business_type || ""}
                    onChange={handleChange}
                >
                    <option value="">Select Business Type</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Importer">Importer</option>
                    <option value="Other">{t("other")}</option>
                </select>

                <input
                    type="text"
                    name="primary_contact_person"
                    placeholder={t("Owner Name")}
                    value={vendor.primary_contact_person || ""}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="gst_number"
                    placeholder="GST Number"
                    value={vendor.gst_number || ""}
                    onChange={handleChange}
                />

                <textarea
                    name="regulatory_certifications"
                    placeholder="Regulatory Certifications"
                    value={vendor.regulatory_certifications || ""}
                    onChange={handleChange}
                />

                <textarea
                    name="bank_account_details"
                    placeholder="Bank Name, Account Number and IFSC/SWIFT Code"
                    value={vendor.bank_account_details || ""}
                    onChange={handleChange}
                />

                <div className="license-upload-field">
                    <label>Proof of Medical License</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleLicensePhoto}
                    />
                </div>

                <input
                    type="text"
                    name="address"
                    placeholder={t("Address")}
                    value={vendor.address || ""}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="city"
                    placeholder={t("City")}
                    value={vendor.city || ""}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="state"
                    placeholder={t("State")}
                    value={vendor.state || ""}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="pincode"
                    placeholder={t("Pincode")}
                    value={vendor.pincode || ""}
                    onChange={handleChange}
                />

            </div>

        </div>

    );

}

export default PharmacyInfo;
