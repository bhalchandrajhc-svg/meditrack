import { useState } from "react";

import CustomerSidebar from "../../components/CustomerSidebar/CustomerSidebar";
import CustomerNavbar from "../../components/CustomerNavbar/CustomerNavbar";

import { customerMenu } from "../../utils/customerMenu.jsx";

import { useTranslation } from "react-i18next";

import "./CustomerLayout.css";

function CustomerLayout({ children }) {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="customer-layout">
            <div
                className={`customer-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={closeSidebar}
            />

            <CustomerSidebar
                menuItems={customerMenu(t)}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div className="customer-main">
                <CustomerNavbar
                    toggleSidebar={toggleSidebar}
                />
                <div className="customer-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default CustomerLayout;