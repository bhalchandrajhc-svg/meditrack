import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/i18n";
import { initTheme } from "./utils/theme";

import App from "./App.jsx";
import { NotificationProvider } from "./context/NotificationContext";
import { CustomerNotificationProvider } from "./context/CustomerNotificationContext";

import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "./styles/global.css";
import "./styles/theme.css";
import "./styles/sidebar.css";
import "./styles/navbar.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/auth.css";
import "./styles/responsive.css";
import "./styles/dark-mode.css";

import { ToastContainer } from "react-toastify";

initTheme();

createRoot(document.getElementById("root")).render(

    <StrictMode>

        <NotificationProvider>

            <CustomerNotificationProvider>

                <App />

                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />

            </CustomerNotificationProvider>

        </NotificationProvider>


    </StrictMode>

);
