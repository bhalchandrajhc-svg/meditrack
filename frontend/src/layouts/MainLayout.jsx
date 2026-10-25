import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import { vendorMenu } from "../utils/menu";
import "./MainLayout.css";

function MainLayout({ menuItems, logo, title, subtitle, showNavbar = true, children }) {
    const { t, i18n } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [, setLangState] = useState(i18n.language);

    useEffect(() => {
        const handleLangChange = () => {
            setLangState(i18n.language);
        };
        i18n.on("languageChanged", handleLangChange);
        window.addEventListener("languageChanged", handleLangChange);

        return () => {
            i18n.off("languageChanged", handleLangChange);
            window.removeEventListener("languageChanged", handleLangChange);
        };
    }, [i18n]);

    const closeSidebar = () => setSidebarOpen(false);

    // Dynamically update menuItems with translated labels
    const currentMenuItems = menuItems || vendorMenu(t);

    return (
        <div className="app-layout">
            <Sidebar
                menuItems={currentMenuItems}
                logo={logo}
                title={title}
                subtitle={subtitle}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            <div className="main-content">
                {showNavbar && (
                    <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />
                )}

                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
