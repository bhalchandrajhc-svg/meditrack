import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";
import ProfileHeader from "../../../components/CustomerProfile/ProfileHeader/ProfileHeader";
import ProfileInfo from "../../../components/CustomerProfile/ProfileInfo/ProfileInfo";
import ProfileActions from "../../../components/CustomerProfile/ProfileActions/ProfileActions";
import { getCustomerProfile, updateCustomerProfile } from "../../../services/customerService";
import { Loader2, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./Profile.css";

function Profile() {
    const { t } = useTranslation();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id || storedUser?.user_id || storedUser?._id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // =====================================
    // Load Customer Profile
    // =====================================
    const loadProfile = async () => {
        if (!userId) {
            toast.error(t("sessionNotFound", "Customer session not found. Please log in."));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await getCustomerProfile(userId);
            setProfile(res.data.profile);
        } catch (err) {
            console.error("Profile load error:", err);
            toast.error(err.response?.data?.message || t("unableToLoadProfile", "Unable to load profile"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateCustomerProfile(userId, profile);
            toast.success(t("profileUpdated", "Profile updated successfully"));
            setEditing(false);
            await loadProfile();
        } catch (err) {
            console.error("Profile save error:", err);
            toast.error(err.response?.data?.message || t("unableToUpdateProfile", "Unable to update profile"));
        }
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="profile-page">
                    <div className="profile-loading-state">
                        <Loader2 size={36} className="loading-spinner" />
                        <p>{t("loadingProfile", "Loading customer profile...")}</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="profile-page">
                {/* Hero Top Title Banner */}
                <div className="profile-top-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <UserCheck size={14} />
                            <span>{t("accountPreferences", "Account & Preferences")}</span>
                        </div>
                        <h2>{t("myProfileTitle", "My Profile")}</h2>
                        <p>{t("myProfileDesc", "Manage your account info, address details, and contact information.")}</p>
                    </div>
                </div>

                <ProfileHeader profile={profile} />

                <ProfileInfo
                    profile={profile}
                    editing={editing}
                    handleChange={handleChange}
                />

                <ProfileActions
                    editing={editing}
                    setEditing={setEditing}
                    handleSave={handleSave}
                    loadProfile={loadProfile}
                />
            </div>
        </CustomerLayout>
    );
}

export default Profile;