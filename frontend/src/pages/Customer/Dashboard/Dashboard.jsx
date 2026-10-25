import CustomerLayout from "../../../layouts/CustomerLayout/CustomerLayout";

import HeroBanner from "../../../components/CustomerDashboard/HeroBanner/HeroBanner";
import DashboardCards from "../../../components/CustomerDashboard/DashboardCards/DashboardCards";
import QuickActions from "../../../components/CustomerDashboard/QuickActions/QuickActions";
import EmergencySection from "../../../components/CustomerDashboard/EmergencySection/EmergencySection";
import HealthTips from "../../../components/CustomerDashboard/HealthTips/HealthTips";

import "./Dashboard.css";

function Dashboard() {
    return (
        <CustomerLayout>
            <div className="customer-dashboard">
                <HeroBanner />
                <DashboardCards />
                <QuickActions />
                <EmergencySection />
                <HealthTips />
            </div>
        </CustomerLayout>
    );
}

export default Dashboard;