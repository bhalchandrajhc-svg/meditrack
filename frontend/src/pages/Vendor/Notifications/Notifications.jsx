
import { useState } from "react";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import NotificationFilter from "../../../components/Notifications/NotificationFilter";
import NotificationTable from "../../../components/Notifications/NotificationTable";

import { useNotification } from "../../../context/NotificationContext";

import "./Notifications.css";

function Notifications() {

    const { t } = useTranslation();

    const { notifications } = useNotification();

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    return (

        <MainLayout
            menuItems={vendorMenu(t)}
            title="Medi Track"
            logo="https://via.placeholder.com/60"
        >

            <div className="notifications-page">

                <div className="page-header">

                    <div>

                        <h2>{t("notifications")}</h2>

                        <p>{t("manage_notifications")}</p>

                    </div>

                </div>

                <NotificationFilter

                    search={search}
                    setSearch={setSearch}

                    category={category}
                    setCategory={setCategory}

                />

                <NotificationTable
                    notifications={notifications}
                />

            </div>

        </MainLayout>

    );

}

export default Notifications;

