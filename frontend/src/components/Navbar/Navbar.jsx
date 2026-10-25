import "./Navbar.css";
import { useEffect, useState } from "react";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useNotification } from "../../context/NotificationContext";
import { getVendorProfile } from "../../api/vendorApi";

import NotificationBell from "../Notifications/NotificationBell";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

function Navbar({ onMenuClick = () => {} }) {

    const { t } = useTranslation();

    const [vendor, setVendor] = useState(null);

    const [showNotifications, setShowNotifications] = useState(false);

    const [showProfile, setShowProfile] = useState(false);

    const {

        notifications,
        unreadCount,
        markAllRead,
        clearAll

    } = useNotification();

    useEffect(() => {

        loadVendor();

    }, []);

    const loadVendor = async () => {

        const loggedVendor = JSON.parse(
            localStorage.getItem("vendor")
        );

        if (!loggedVendor) return;

        try {

            const res = await getVendorProfile(
                loggedVendor.id
            );

            setVendor(res.data);

            localStorage.setItem(
                "vendor",
                JSON.stringify(res.data)
            );

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <header className="navbar">

            <div className="navbar-left">

                <button className="menu-btn" type="button" onClick={onMenuClick} aria-label="Open navigation menu">
                    <Menu size={22} />
                </button>

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder={t("searchMedicines")}
                    />

                </div>

            </div>

            <div className="navbar-right">

                <div
                    className="notification-wrapper"
                    style={{ position: "relative" }}
                >

                    <NotificationBell
                        count={unreadCount}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                    />

                    {showNotifications && (

                        <NotificationDropdown
                            notifications={notifications}
                            markAllRead={markAllRead}
                            clearAll={clearAll}
                            onClose={() => setShowNotifications(false)}
                        />

                    )}

                </div>

                <div
                    className="profile-wrapper"
                    style={{ position: "relative" }}
                >

                    <div
                        className="profile"
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                    >

                        <img
                            src={
                                vendor?.shop_photo
                                    ? `http://localhost:5000/uploads/shop_photos/${vendor.shop_photo}`
                                    : "https://i.pravatar.cc/150?img=12"
                            }
                            alt="Vendor"
                        />

                        <div>

                            <h4>
                                {vendor?.shop_name || "Medical Store"}
                            </h4>

                            <small>
                                {vendor?.owner_name || "Vendor"}
                            </small>

                        </div>

                        <ChevronDown size={18} />

                    </div>

                    {showProfile && (
                        <ProfileDropdown
                            onClose={() => setShowProfile(false)}
                        />
                    )}

                </div>

            </div>

        </header>

    );
}

export default Navbar;