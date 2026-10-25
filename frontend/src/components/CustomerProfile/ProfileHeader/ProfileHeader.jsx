import { User, Mail, ShieldCheck, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ProfileHeader.css";

function ProfileHeader({ profile }) {
    const { t } = useTranslation();
    const customerName = profile?.username || t("customerFallback", "Customer");
    const customerEmail = profile?.email || t("emailNotAvailable", "Email Not Available");
    const profileImage = profile?.profile_photo
        ? `http://localhost:5000/uploads/customer_profiles/${profile.profile_photo}`
        : "https://placehold.co/160x160/e2e8f0/1e293b?text=User";

    return (
        <div className="profile-hero-card">
            <div className="profile-cover-banner" />
            <div className="profile-hero-content">
                <div className="avatar-wrapper">
                    <img
                        src={profileImage}
                        alt={customerName}
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/160x160/e2e8f0/1e293b?text=User";
                        }}
                    />
                        <div className="avatar-badge" title={t("verifiedCustomer", "Verified Customer")}>
                            <ShieldCheck size={14} />
                        </div>
                </div>

                <div className="profile-user-details">
                    <div className="name-row">
                        <h2>{customerName}</h2>
                        <span className="verified-pill">
                            <ShieldCheck size={12} /> {t("verifiedCustomer", "Verified Customer")}
                        </span>
                    </div>

                    <div className="email-row">
                        <Mail size={15} className="email-icon" />
                        <span>{customerEmail}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;