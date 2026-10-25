import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import ReportSummary from "../../../components/Reports/ReportSummary";
import ReportFilter from "../../../components/Reports/ReportFilter";
import SalesChart from "../../../components/Reports/SalesChart";
import RevenuePieChart from "../../../components/Reports/RevenuePieChart";
import TopMedicineChart from "../../../components/Reports/TopMedicineChart";
import AiReportModule from "../../../components/Reports/AiReportModule";
import ReportTable from "../../../components/Reports/ReportTable";
import ExportReportButtons from "../../../components/Reports/ExportReportButtons";

import {
    getDashboard,
    getMonthlyRevenue,
    getOrderStatus,
    getTopMedicines,
    getOrders,
    getAiInsights
} from "../../../api/reportApi";

import "./Reports.css";

function Reports() {

    const { t } = useTranslation();

    const vendor = JSON.parse(localStorage.getItem("vendor"));
    const vendorId = vendor?.id;

    const [dashboard, setDashboard] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        medicinesSold: 0,
        completedOrders: 0
    });

    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [topMedicines, setTopMedicines] = useState([]);
    const [reports, setReports] = useState([]);
    const [aiData, setAiData] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Status");

    useEffect(() => {

        if (vendorId) {

            loadReports();

        }

    }, [vendorId]);

    const loadReports = async () => {

        try {

            const currentVendor = JSON.parse(localStorage.getItem("vendor"));
            const currentVendorId = currentVendor?.id || vendorId;

            if (!currentVendorId) return;

            setAiLoading(true);

            const [

                dashboardRes,
                revenueRes,
                statusRes,
                medicineRes,
                ordersRes,
                aiRes

            ] = await Promise.all([

                getDashboard(currentVendorId),
                getMonthlyRevenue(currentVendorId),
                getOrderStatus(currentVendorId),
                getTopMedicines(currentVendorId),
                getOrders(currentVendorId),
                getAiInsights(currentVendorId).catch(() => ({ data: { aiInsights: null } }))

            ]);

            console.log("Dashboard :", dashboardRes.data);
            console.log("Revenue :", revenueRes.data);
            console.log("Status :", statusRes.data);
            console.log("Top Medicines :", medicineRes.data);
            console.log("Orders :", ordersRes.data);
            console.log("AI Insights :", aiRes.data);

            setDashboard(dashboardRes.data);
            setMonthlyRevenue(revenueRes.data);
            setStatusData(statusRes.data);
            setTopMedicines(medicineRes.data);
            setReports(ordersRes.data);
            setAiData(aiRes.data?.aiInsights || null);

        }

        catch (err) {

            console.log("Reports Error :", err);

        }

        finally {

            setAiLoading(false);

        }

    };

    const handleRefreshAi = async () => {
        const currentVendor = JSON.parse(localStorage.getItem("vendor"));
        const currentVendorId = currentVendor?.id || vendorId;
        if (!currentVendorId) return;

        try {
            setAiLoading(true);
            const res = await getAiInsights(currentVendorId);
            setAiData(res.data?.aiInsights || null);
        } catch (err) {
            console.log("AI Refresh Error:", err);
        } finally {
            setAiLoading(false);
        }
    };

    const filteredReports = reports.filter((item) => {

        const searchMatch =

            item.customer
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.medicine
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const statusMatch =

            status === "All Status" ||

            item.status === status;

        return searchMatch && statusMatch;

    });

    return (

        <MainLayout

            menuItems={vendorMenu(t)}

            title="Medi Track"

            logo="https://via.placeholder.com/60"

        >

            <div className="reports-page">

                <div className="page-header">

                    <div>

                        <h2>Reports & Analytics</h2>

                        <p>
                            Sales, Revenue & AI Smart Store Recommendations
                        </p>

                    </div>

                </div>

                <ReportSummary dashboard={dashboard} />

                <ReportFilter

                    search={search}

                    setSearch={setSearch}

                    status={status}

                    setStatus={setStatus}

                />

                <SalesChart reports={monthlyRevenue} />

                <div className="report-grid">

                    <RevenuePieChart

                        data={statusData}

                    />

                    <TopMedicineChart

                        data={topMedicines}

                    />

                </div>

                {/* AI Smart Insights Module */}
                <AiReportModule
                    aiData={aiData}
                    loading={aiLoading}
                    onRefresh={handleRefreshAi}
                />

                <ReportTable

                    reports={filteredReports}

                />

                <ExportReportButtons />

            </div>

        </MainLayout>

    );

}

export default Reports;