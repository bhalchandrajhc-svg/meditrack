import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import MainLayout from "../../../layouts/MainLayout";
import { vendorMenu } from "../../../utils/menu";

import SearchFilter from "../../../components/Medicines/SearchFilter";
import MedicineTable from "../../../components/Medicines/MedicineTable";
import AddMedicineModal from "../../../components/Medicines/AddMedicineModal";
import ViewMedicineModal from "../../../components/Medicines/ViewMedicineModal/ViewMedicineModal";
import DeleteConfirmModal from "../../../components/Common/DeleteConfirmModal";

import { useNotification } from "../../../context/NotificationContext";
import socket from "../../../services/socket";

import {
    getMedicines,
    addMedicine as addMedicineApi,
    updateMedicine as updateMedicineApi,
    deleteMedicine as deleteMedicineApi,
    toggleMedicineVisibility
} from "../../../api/medicineApi";

import "./Medicines.css";

function Medicines() {

    const { t } = useTranslation();

    const {

        addNotification,

        refreshApp,

        refreshKey

    } = useNotification();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [status, setStatus] = useState("All Status");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const [editingMedicine, setEditingMedicine] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteMedicineId, setDeleteMedicineId] = useState(null);

    const [medicines, setMedicines] = useState([]);

    // ==========================
    // Load Medicines
    // ==========================

    const loadMedicines = useCallback(async () => {

        try {

            const res = await getMedicines();

            setMedicines(res.data);

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to load medicines");

        }

    }, []);

    // ==========================
    // Initial Load
    // ==========================

    useEffect(() => {

        loadMedicines();

    }, [loadMedicines, refreshKey]);

    // ==========================
    // Socket Events
    // ==========================

    useEffect(() => {

        socket.on("medicineUpdated", loadMedicines);

        socket.on("inventoryRefresh", loadMedicines);

        socket.on("dashboardRefresh", loadMedicines);

        socket.on("orderCreated", loadMedicines);

        return () => {

            socket.off("medicineUpdated", loadMedicines);

            socket.off("inventoryRefresh", loadMedicines);

            socket.off("dashboardRefresh", loadMedicines);

            socket.off("orderCreated", loadMedicines);

        };

    }, [loadMedicines]);

        // ==========================
    // Add / Update Medicine
    // ==========================

    const addMedicine = async (formData) => {

        try {

            if (editingMedicine) {

                await updateMedicineApi(

                    editingMedicine.id,

                    formData

                );

                toast.success("Medicine Updated Successfully");

            }

            else {

                await addMedicineApi(formData);

                toast.success("Medicine Added Successfully");

            }

            await loadMedicines();

            addNotification();

            refreshApp();

            setEditingMedicine(null);

            setIsModalOpen(false);

        }

        catch (err) {

            console.log(err);

            toast.error("Something went wrong");

        }

    };

    // ==========================
    // Toggle Visibility
    // ==========================

    const toggleVisibility = async (id) => {

        try {

            await toggleMedicineVisibility(id);

            await loadMedicines();

            refreshApp();

            toast.success("Medicine visibility updated");

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to update visibility");

        }

    };

    // ==========================
    // View Medicine
    // ==========================

    const viewMedicine = (medicine) => {

        setSelectedMedicine(medicine);

        setIsViewOpen(true);

    };

    // ==========================
    // Edit Medicine
    // ==========================

    const editMedicine = (medicine) => {

        setEditingMedicine(medicine);

        setIsModalOpen(true);

    };

    // ==========================
    // Delete Medicine
    // ==========================

    const deleteMedicine = (id) => {

        setDeleteMedicineId(id);

        setIsDeleteOpen(true);

    };

    const confirmDeleteMedicine = async () => {

        try {

            await deleteMedicineApi(deleteMedicineId);

            toast.success("Medicine Deleted Successfully");

            await loadMedicines();

            addNotification();

            refreshApp();

            setDeleteMedicineId(null);

            setIsDeleteOpen(false);

        }

        catch (err) {

            console.log(err);

            toast.error("Delete Failed");

        }

    };

    // ==========================
    // Search Filter
    // ==========================

    const filteredMedicines = medicines.filter((medicine) => {

        const matchSearch =

            medicine.name

                .toLowerCase()

                .includes(search.toLowerCase());

        const matchCategory =

            category === "All Categories" ||

            medicine.category === category;

        const matchStatus =

            status === "All Status" ||

            medicine.status === status;

        return (

            matchSearch &&

            matchCategory &&

            matchStatus

        );

    });

    return (

        <MainLayout

            menuItems={vendorMenu(t)}

            title="Medi Track"

            logo="/logo.png"

        >

            <div className="medicine-page">

                <div className="page-header">

                    <div>

                        <h2>{t("medicines")}</h2>

                        <p>{t("manage_medicines")}</p>

                    </div>

                    <button

                        className="add-btn"

                        onClick={() => {

                            setEditingMedicine(null);

                            setIsModalOpen(true);

                        }}

                    >

                        + {t("add_medicine")}

                    </button>

                </div>

                <SearchFilter

                    search={search}

                    setSearch={setSearch}

                    category={category}

                    setCategory={setCategory}

                    status={status}

                    setStatus={setStatus}

                />

                <MedicineTable

                    medicines={filteredMedicines}

                    toggleVisibility={toggleVisibility}

                    onView={viewMedicine}

                    onEdit={editMedicine}

                    onDelete={deleteMedicine}

                />

            </div>

            <AddMedicineModal

                isOpen={isModalOpen}

                onClose={() => {

                    setIsModalOpen(false);

                    setEditingMedicine(null);

                }}

                onSave={addMedicine}

                editingMedicine={editingMedicine}

            />

            <ViewMedicineModal

                isOpen={isViewOpen}

                onClose={() => setIsViewOpen(false)}

                medicine={selectedMedicine}

            />

            <DeleteConfirmModal

                isOpen={isDeleteOpen}

                onClose={() => {

                    setIsDeleteOpen(false);

                    setDeleteMedicineId(null);

                }}

                onConfirm={confirmDeleteMedicine}

            />

        </MainLayout>

    );

}

export default Medicines;