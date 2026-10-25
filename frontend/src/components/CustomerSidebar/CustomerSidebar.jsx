import { NavLink } from "react-router-dom";
import { HeartPulse, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./CustomerSidebar.css";

function CustomerSidebar({
    menuItems,
    isOpen,
    onClose = () => {}
}) {
    const { t } = useTranslation();
    return (
        <aside className={`customer-sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-logo">
                <div className="logo-brand">
                    <span className="logo-icon"><HeartPulse size={20} /></span>
                    <h2>Medi Track</h2>
                </div>
                <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label={t("closeSidebar", "Close sidebar")}>
                    <X size={20} />
                </button>
            </div>

            <nav>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="icon">
                            {item.icon}
                        </span>
                        <span>
                            {item.title}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default CustomerSidebar;