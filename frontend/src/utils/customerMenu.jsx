import {
    LayoutDashboard,
    Search,
    Building2,
    Package,
    Bell,
    User,
    Settings,
    LogOut
} from "lucide-react";

export const customerMenu = (t) => {
    const getTitle = (key, fallback) => {
        const val = t(key);
        return !val || val === key ? fallback : val;
    };

    return [
        {
            title: getTitle("dashboard", "Dashboard"),
            icon: <LayoutDashboard size={20} />,
            path: "/customer/dashboard"
        },
        {
            title: getTitle("findMedicines", "Find Medicines"),
            icon: <Search size={20} />,
            path: "/customer/medicines"
        },
        {
            title: getTitle("nearbyPharmacies", "Nearby Pharmacies"),
            icon: <Building2 size={20} />,
            path: "/customer/pharmacies"
        },
        {
            title: getTitle("myOrders", "My Orders"),
            icon: <Package size={20} />,
            path: "/customer/orders"
        },
        {
            title: getTitle("notifications", "Notifications"),
            icon: <Bell size={20} />,
            path: "/customer/notifications"
        },
        {
            title: getTitle("profile", "Profile"),
            icon: <User size={20} />,
            path: "/customer/profile"
        },
        {
            title: getTitle("settings", "Settings"),
            icon: <Settings size={20} />,
            path: "/customer/settings"
        },
        {
            title: getTitle("logout", "Logout"),
            icon: <LogOut size={20} />,
            path: "/login"
        }
    ];
};