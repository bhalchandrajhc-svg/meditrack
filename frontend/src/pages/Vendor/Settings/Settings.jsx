import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import ProfileCard from "../../../components/Settings/ProfileCard";
import PharmacyInfo from "../../../components/Settings/PharmacyInfo";
import SecuritySettings from "../../../components/Settings/SecuritySettings";
import PreferenceSettings from "../../../components/Settings/PreferenceSettings";
import SaveSettings from "../../../components/Settings/SaveSettings";

import {
    getVendorProfile,
    updateVendorProfile
} from "../../../api/vendorApi";

import { useNotification } from "../../../context/NotificationContext";

import "./Settings.css";

function Settings() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addNotification } = useNotification();

    const loggedVendor = JSON.parse(localStorage.getItem("vendor"));
    const vendorId = loggedVendor?.id;

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!vendorId) {

            toast.error("Vendor not logged in");
            navigate("/login");
            return;

        }

        loadVendor();

    }, []);

    const loadVendor = async () => {

        try {

            const res = await getVendorProfile(vendorId);

            const vendorData = res.data.data || res.data;

            setVendor(vendorData);

            localStorage.setItem(
                "vendor",
                JSON.stringify(vendorData)
            );

            window.dispatchEvent(
                new Event("vendorUpdated")
            );

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to load vendor profile.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleSave = async () => {

        try {

            const formData = new FormData();

            formData.append("owner_name", vendor.owner_name || "");
            formData.append("shop_name", vendor.shop_name || "");
            formData.append("email", vendor.email || "");
            formData.append("mobile", vendor.mobile || "");
            formData.append("license_number", vendor.license_number || "");
            formData.append("gst_number", vendor.gst_number || "");
            formData.append("address", vendor.address || "");
            formData.append("city", vendor.city || "");
            formData.append("state", vendor.state || "");
            formData.append("pincode", vendor.pincode || "");
            formData.append("latitude", vendor.latitude || "");
            formData.append("longitude", vendor.longitude || "");
            formData.append("vendor_legal_name", vendor.vendor_legal_name || "");
            formData.append("business_type", vendor.business_type || "");
            formData.append("primary_contact_person", vendor.primary_contact_person || "");
            formData.append("regulatory_certifications", vendor.regulatory_certifications || "");
            formData.append("bank_account_details", vendor.bank_account_details || "");

            if (vendor.shop_photo instanceof File) {

                formData.append(
                    "shop_photo",
                    vendor.shop_photo
                );

            }

            if (vendor.license_photo instanceof File) {
                formData.append("license_photo", vendor.license_photo);
            }

            await updateVendorProfile(
                vendorId,
                formData
            );

            toast.success("✅ Profile Updated Successfully");

            // Save notification in DB
            await addNotification({
                vendor_id: vendorId,
                title: "Profile Updated ⚙️",
                message: `Your vendor profile (${vendor.shop_name}) was updated successfully.`,
                type: "settings"
            });

            loadVendor();

        }

        catch (err) {

            console.log(err);

            toast.error("Profile Update Failed");

        }

    };

    if (loading) {

        return <h2>{t("loading")}...</h2>;

    }

    if (!vendor) {

        return <h2>No Vendor Data Found</h2>;

    }

    return (

        <MainLayout
            menuItems={vendorMenu(t)}
            title="Medi Track"
            logo="/logo.png"
        >

            <div className="settings-page">

                <div className="page-header">

                    <div>

                        <h2>{t("settings")}</h2>

                        <p>
                            {t("manageVendorProfile")}
                        </p>

                    </div>

                </div>

                <ProfileCard
                    vendor={vendor}
                    setVendor={setVendor}
                />

                <PharmacyInfo
                    vendor={vendor}
                    setVendor={setVendor}
                />

                <SecuritySettings
                    vendorId={vendorId}
                />

                <PreferenceSettings />

                <SaveSettings
                    onSave={handleSave}
                />

            </div>

        </MainLayout>

    );

}

export default Settings;
