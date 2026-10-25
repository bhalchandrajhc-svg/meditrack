import {
    LayoutDashboard,
    Pill,
    Package,
    Bell,
    Settings,
    LogOut,
    Boxes,
    BarChart3
} from "lucide-react";

export const vendorMenu = (t) => [

    {
        name: t("dashboard"),
        path: "/vendor/dashboard",
        icon: <LayoutDashboard size={20}/>
    },

    {
        name: t("medicines"),
        path: "/vendor/medicines",
        icon: <Pill size={20}/>
    },

    {
        name: t("inventory"),
        path: "/vendor/inventory",
        icon: <Boxes size={20}/>
    },

    {
        name: t("orders"),
        path: "/vendor/orders",
        icon: <Package size={20}/>
    },

    {
        name: t("notifications"),
        path: "/vendor/notifications",
        icon: <Bell size={20}/>
    },

    {
        name: t("reports"),
        path: "/vendor/reports",
        icon: <BarChart3 size={20}/>
    },

    {
        name: t("settings"),
        path: "/vendor/settings",
        icon: <Settings size={20}/>
    },

    {
        name: t("logout"),
        path: "/",
        icon: <LogOut size={20}/>
    }

];