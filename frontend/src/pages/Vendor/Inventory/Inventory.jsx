import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import {
    getInventory,
    getInventoryDashboard,
    getCategoryStock,
    getStockOverview,
    getStockHistory,
    updateMedicineStock
} from "../../../api/inventoryApi";

import { useNotification } from "../../../context/NotificationContext";
import socket from "../../../services/socket";

import InventorySummary from "../../../components/Inventory/InventorySummary";
import InventoryAnalytics from "../../../components/Inventory/InventoryAnalytics";
import InventoryFilter from "../../../components/Inventory/InventoryFilter";
import InventoryTable from "../../../components/Inventory/InventoryTable";
import UpdateStockModal from "../../../components/Inventory/UpdateStockModal";
import ViewInventoryModal from "../../../components/Inventory/ViewInventoryModal";
import StockHistory from "../../../components/Inventory/StockHistory";
import ExportButtons from "../../../components/Inventory/ExportButtons";

import "./Inventory.css";

function Inventory() {

    const loggedVendor = JSON.parse(localStorage.getItem("vendor"));
    const vendorId = loggedVendor?.id;

    const { t } = useTranslation();

    const { addNotification, refreshKey } = useNotification();

    const [medicines, setMedicines] = useState([]);
    const [history, setHistory] = useState([]);
    const [dashboard, setDashboard] = useState({});
    const [categoryChart, setCategoryChart] = useState([]);
    const [overviewChart, setOverviewChart] = useState({});

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [stockStatus, setStockStatus] = useState("All Stock");

    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    // ==========================================
    // Load Inventory
    // ==========================================

    const loadInventory = useCallback(async () => {

        try {

            const currentVendor = JSON.parse(localStorage.getItem("vendor"));
            const currentVendorId = currentVendor?.id || vendorId;

            if (!currentVendorId) return;

            const [

                inventoryRes,
                historyRes,
                dashboardRes,
                categoryRes,
                overviewRes

            ] = await Promise.all([

                getInventory(currentVendorId),

                getStockHistory(vendorId),

                getInventoryDashboard(vendorId),

                getCategoryStock(vendorId),

                getStockOverview(vendorId)

            ]);

            setMedicines(inventoryRes.data);

            setHistory(historyRes.data);

            setDashboard(dashboardRes.data);

            setCategoryChart(categoryRes.data);

            setOverviewChart(overviewRes.data);

        }

        catch (err) {

            console.log(err);

        }

    }, [vendorId]);

    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        loadInventory();

    }, [loadInventory, refreshKey]);

    // ==========================================
    // Socket Events
    // ==========================================

    useEffect(() => {

        socket.on("inventoryRefresh", loadInventory);

        socket.on("medicineUpdated", loadInventory);

        socket.on("orderCreated", loadInventory);

        socket.on("orderStatusUpdated", loadInventory);

        socket.on("dashboardRefresh", loadInventory);

        return () => {

            socket.off("inventoryRefresh", loadInventory);

            socket.off("medicineUpdated", loadInventory);

            socket.off("orderCreated", loadInventory);

            socket.off("orderStatusUpdated", loadInventory);

            socket.off("dashboardRefresh", loadInventory);

        };

    }, [loadInventory]);

        // ==========================================
    // Update Stock
    // ==========================================

    const updateStock = async (data) => {

        try {

            await updateMedicineStock({

                medicineId: data.medicineId,

                type: data.type,

                quantity: data.quantity,

                reason: data.reason

            });

            toast.success("Stock Updated Successfully");

            addNotification({

                title: "Inventory Updated",

                message: "Medicine stock updated successfully.",

                type: "success"

            });

            await loadInventory();

            setIsUpdateOpen(false);

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to update stock");

        }

    };

    // ==========================================
    // Search & Filter
    // ==========================================

    const filteredMedicines = medicines.filter((medicine) => {

        const searchMatch =

            medicine.name.toLowerCase().includes(search.toLowerCase()) ||

            medicine.company.toLowerCase().includes(search.toLowerCase());

        const categoryMatch =

            category === "All Categories" ||

            medicine.category === category;

        const stockMatch =

            stockStatus === "All Stock" ||

            (stockStatus === "In Stock" && medicine.stock > 10) ||

            (stockStatus === "Low Stock" &&
                medicine.stock > 0 &&
                medicine.stock <= 10) ||

            (stockStatus === "Out Of Stock" &&
                medicine.stock === 0);

        return searchMatch && categoryMatch && stockMatch;

    });

    return (

        <MainLayout
            menuItems={vendorMenu(t)}
            title="Medi Track"
            logo="/logo.png"
        >

            <div className="inventory-page">

                <div className="page-header">

                    <div>

                        <h2>{t("inventory")}</h2>

                        <p>{t("manage_inventory")}</p>

                    </div>

                </div>

                <InventorySummary

                    medicines={medicines}

                    dashboard={dashboard}

                />

                <InventoryAnalytics

                    medicines={medicines}

                    categoryChart={categoryChart}

                    overviewChart={overviewChart}

                    dashboard={dashboard}

                />

                <InventoryFilter

                    search={search}

                    setSearch={setSearch}

                    category={category}

                    setCategory={setCategory}

                    stockStatus={stockStatus}

                    setStockStatus={setStockStatus}

                />

                <ExportButtons

                    medicines={filteredMedicines}

                />

                <InventoryTable

                    medicines={filteredMedicines}

                    onView={(medicine) => {

                        setSelectedMedicine(medicine);

                        setIsViewOpen(true);

                    }}

                    onUpdate={(medicine) => {

                        setSelectedMedicine(medicine);

                        setIsUpdateOpen(true);

                    }}

                />

                <StockHistory

                    history={history}

                />

            </div>

            <UpdateStockModal

                isOpen={isUpdateOpen}

                onClose={() => setIsUpdateOpen(false)}

                medicine={selectedMedicine}

                onSave={updateStock}

            />

            <ViewInventoryModal

                isOpen={isViewOpen}

                onClose={() => setIsViewOpen(false)}

                medicine={selectedMedicine}

            />

        </MainLayout>

    );

}

export default Inventory;