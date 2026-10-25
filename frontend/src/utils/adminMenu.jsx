import { Bell, LayoutDashboard, Store, LogOut } from "lucide-react";

export const adminMenu = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard size={20} />
    },
    {
        name: "Vendor Info",
        path: "/admin/vendor-info",
        icon: <Store size={20} />
    },
    {
        name: "Notifications",
        path: "/admin/notifications",
        icon: <Bell size={20} />
    },
    {
        name: "Logout",
        path: "/weblogin",
        icon: <LogOut size={20} />
    }
];
