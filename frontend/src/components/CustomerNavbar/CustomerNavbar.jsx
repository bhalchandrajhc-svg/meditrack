import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Menu,
    Bell,
    Globe,
    User,
    CheckCheck,
    Trash2,
    Settings,
    LogOut
} from "lucide-react";

import { useTranslation } from "react-i18next";

import {
    useNotification
} from "../../context/NotificationContext";

import "./CustomerNavbar.css";


function CustomerNavbar({ toggleSidebar }) {

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();


    // =====================================
    // Logged Customer
    // =====================================

    const customer = JSON.parse(
        localStorage.getItem("user")
    );


    // =====================================
    // Notification Context
    // =====================================

    const {

        customerNotifications,

        customerUnreadCount,

        markCustomerNotificationsRead,

        clearCustomerNotifications

    } = useNotification();


    // =====================================
    // States
    // =====================================

    const [languageOpen, setLanguageOpen] =
        useState(false);

    const [notificationOpen, setNotificationOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);


    // =====================================
    // Change Language
    // =====================================

    const changeLanguage = (language) => {

        i18n.changeLanguage(language);

        localStorage.setItem(
            "language",
            language
        );

        setLanguageOpen(false);

    };


    // =====================================
    // Language Toggle
    // =====================================

    const toggleLanguage = () => {

        setLanguageOpen(
            prev => !prev
        );

        setNotificationOpen(false);

        setProfileOpen(false);

    };


    // =====================================
    // Notification Toggle
    // =====================================

    const toggleNotifications = () => {

        setNotificationOpen(
            prev => !prev
        );

        setLanguageOpen(false);

        setProfileOpen(false);

    };


    // =====================================
    // Profile Toggle
    // =====================================

    const toggleProfile = () => {

        setProfileOpen(
            prev => !prev
        );

        setLanguageOpen(false);

        setNotificationOpen(false);

    };


    // =====================================
    // Mark All Read
    // =====================================

    const handleMarkAllRead = async () => {

        await markCustomerNotificationsRead();

    };


    // =====================================
    // Clear All Notifications
    // =====================================

    const handleClearAll = async () => {

        if (customerNotifications.length === 0) {
            return;
        }

        const confirmClear =
            window.confirm(
                t("confirmClearNotifications", "Clear all notifications?")
            );

        if (!confirmClear) {
            return;
        }

        await clearCustomerNotifications();

    };


    // =====================================
    // Go To Profile
    // =====================================

    const handleProfile = () => {

        setProfileOpen(false);

        navigate("/customer/profile");

    };


    // =====================================
    // Go To Settings
    // =====================================

    const handleSettings = () => {

        setProfileOpen(false);

        navigate("/customer/settings");

    };


    // =====================================
    // Logout
    // =====================================

    const handleLogout = () => {

        const confirmLogout =
            window.confirm(
                t("confirmLogout", "Are you sure you want to logout?")
            );

        if (!confirmLogout) {
            return;
        }


        // Remove customer login data

        localStorage.removeItem("user");

        localStorage.removeItem("token");


        // Do not remove language preference


        setProfileOpen(false);


        // Login Page

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // =====================================
    // Customer Display Name
    // =====================================

    const customerName =
        customer?.username ||
        customer?.name ||
        t("customerFallback", "Customer");


    const customerEmail =
        customer?.email ||
        t("emailUnavailable", "No email available");


    // =====================================
    // Render
    // =====================================

    return (

        <header className="customer-navbar">


            {/* ================================= */}
            {/* LEFT */}
            {/* ================================= */}

            <div className="navbar-left">

                <button
                    type="button"
                    className="menu-btn"
                    onClick={toggleSidebar}
                >

                    <Menu size={24} />

                </button>


                <h2>
                    {t("customerDashboard", "Customer Dashboard")}
                </h2>

            </div>


            {/* ================================= */}
            {/* RIGHT */}
            {/* ================================= */}

            <div className="navbar-right">


                {/* ================================= */}
                {/* LANGUAGE */}
                {/* ================================= */}

                <div className="customer-navbar-dropdown">

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleLanguage}
                    >

                        <Globe size={20} />

                    </button>


                    {
                        languageOpen && (

                            <div className="customer-language-menu">

                                <button
                                    type="button"
                                    onClick={() =>
                                        changeLanguage("en")
                                    }
                                >

                                    {t("english", "English")}

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        changeLanguage("mr")
                                    }
                                >

                                    {t("marathi", "मराठी")}

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        changeLanguage("hi")
                                    }
                                >

                                    {t("hindi", "हिन्दी")}

                                </button>

                            </div>

                        )
                    }

                </div>


                {/* ================================= */}
                {/* NOTIFICATIONS */}
                {/* ================================= */}

                <div className="customer-navbar-dropdown">

                    <button
                        type="button"
                        className="icon-btn customer-bell-btn"
                        onClick={toggleNotifications}
                    >

                        <Bell size={20} />


                        {
                            customerUnreadCount > 0 && (

                                <span className="customer-notification-badge">

                                    {
                                        customerUnreadCount > 99
                                            ? "99+"
                                            : customerUnreadCount
                                    }

                                </span>

                            )
                        }

                    </button>


                    {
                        notificationOpen && (

                            <div className="customer-notification-menu">


                                {/* Header */}

                                <div className="customer-notification-header">

                                    <div>

                                        <h4>
                                            {t("notificationsTitle", "Notifications")}
                                        </h4>

                                        <span>

                                            {
                                                customerUnreadCount
                                            } {t("unread", "unread")}

                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        className="notification-read-btn"
                                        onClick={handleMarkAllRead}
                                        disabled={
                                            customerUnreadCount === 0
                                        }
                                        title={t("markAllAsRead", "Mark all as read")}
                                    >

                                        <CheckCheck size={18} />

                                    </button>

                                </div>


                                {/* List */}

                                <div className="customer-notification-list">

                                    {
                                        customerNotifications.length === 0 ? (

                                            <div className="customer-no-notification">

                                                <Bell size={28} />

                                                <p>
                                                    {t("noNotifications", "No notifications")}
                                                </p>

                                            </div>

                                        ) : (

                                            customerNotifications.map(
                                                (notification) => (

                                                    <div
                                                        key={notification.id}
                                                        className={
                                                            Number(
                                                                notification.is_read
                                                            ) === 0
                                                                ? "customer-notification-item unread"
                                                                : "customer-notification-item"
                                                        }
                                                    >

                                                        <div className="notification-dot" />


                                                        <div className="notification-content">

                                                            <strong>

                                                                {
                                                                    notification.title ||
                                                                    "Notification"
                                                                }

                                                            </strong>


                                                            <p>

                                                                {
                                                                    notification.message
                                                                }

                                                            </p>


                                                            {
                                                                notification.created_at && (

                                                                    <small>

                                                                        {
                                                                            new Date(
                                                                                notification.created_at
                                                                            ).toLocaleString()
                                                                        }

                                                                    </small>

                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                )
                                            )

                                        )
                                    }

                                </div>


                                {/* Footer */}

                                {
                                    customerNotifications.length > 0 && (

                                        <div className="customer-notification-footer">

                                            <button
                                                type="button"
                                                onClick={handleMarkAllRead}
                                                disabled={
                                                    customerUnreadCount === 0
                                                }
                                            >

                                                <CheckCheck size={16} />

                                                {t("markAllRead", "Mark All Read")}

                                            </button>


                                            <button
                                                type="button"
                                                className="clear-notification-btn"
                                                onClick={handleClearAll}
                                            >

                                                <Trash2 size={16} />

                                                {t("clearAll", "Clear All")}

                                            </button>

                                        </div>

                                    )
                                }

                            </div>

                        )
                    }

                </div>


                {/* ================================= */}
                {/* PROFILE */}
                {/* ================================= */}

                <div className="customer-navbar-dropdown">

                    <button
                        type="button"
                        className="profile-btn"
                        onClick={toggleProfile}
                    >

                        <User size={20} />

                        <span>
                            {customerName}
                        </span>

                    </button>


                    {/* ================================= */}
                    {/* PROFILE DROPDOWN */}
                    {/* ================================= */}

                    {
                        profileOpen && (

                            <div className="customer-profile-menu">


                                {/* Customer Info */}

                                <div className="customer-profile-info">

                                    <div className="customer-profile-avatar">

                                        <User size={24} />

                                    </div>


                                    <div className="customer-profile-details">

                                        <strong>
                                            {customerName}
                                        </strong>

                                        <span>
                                            {customerEmail}
                                        </span>

                                    </div>

                                </div>


                                <div className="customer-profile-divider" />


                                {/* My Profile */}

                                <button
                                    type="button"
                                    className="customer-profile-menu-item"
                                    onClick={handleProfile}
                                >

                                    <User size={18} />

                                    <span>
                                        {t("myProfileNav", "My Profile")}
                                    </span>

                                </button>


                                {/* Settings */}

                                <button
                                    type="button"
                                    className="customer-profile-menu-item"
                                    onClick={handleSettings}
                                >

                                    <Settings size={18} />

                                    <span>
                                        {t("settingsNav", "Settings")}
                                    </span>

                                </button>


                                <div className="customer-profile-divider" />


                                {/* Logout */}

                                <button
                                    type="button"
                                    className="customer-profile-menu-item customer-logout-btn"
                                    onClick={handleLogout}
                                >

                                    <LogOut size={18} />

                                    <span>
                                        {t("logout", "Logout")}
                                    </span>

                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

        </header>

    );

}


export default CustomerNavbar;