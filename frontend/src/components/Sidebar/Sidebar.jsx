import { NavLink } from "react-router-dom";
import { HeartPulse, X } from "lucide-react";
import "./Sidebar.css";

function Sidebar({
    menuItems,
    logo,
    title = "Medi Track",
    subtitle = "Vendor Panel",
    isOpen = false,
    onClose = () => {}
}) {
    return (
        <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
                <div className="logo-brand">
                    <span className="logo-icon">
                        <HeartPulse size={20} />
                    </span>
                    <div>
                        <h3>{title}</h3>
                        <small>{subtitle}</small>
                    </div>
                </div>

                <button
                    type="button"
                    className="sidebar-close-btn"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X size={20} />
                </button>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
