
import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/inventory`;

// ===============================
// Dashboard Summary
// ===============================
export const getInventoryDashboard = (vendorId) => {
    return axios.get(`${API_URL}/dashboard/${vendorId}`);
};

// ===============================
// Inventory Medicines
// ===============================
export const getInventory = (vendorId) => {
    return axios.get(`${API_URL}/${vendorId}`);
};

// ===============================
// Category Wise Stock Chart
// ===============================
export const getCategoryStock = (vendorId) => {
    return axios.get(`${API_URL}/category/${vendorId}`);
};

// ===============================
// Stock Overview Chart
// ===============================
export const getStockOverview = (vendorId) => {
    return axios.get(`${API_URL}/overview/${vendorId}`);
};

// ===============================
// Stock History
// ===============================
export const getStockHistory = (vendorId) => {
    return axios.get(`${API_URL}/history/${vendorId}`);
};

// ===============================
// Update Medicine Stock
// ===============================
export const updateMedicineStock = (data) => {
    return axios.put(`${API_URL}/update-stock`, data);
};

