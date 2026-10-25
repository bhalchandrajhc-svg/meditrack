import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/customer`;


// =====================================
// Get All Medicines
// =====================================

export const getMedicines = (search = "") => {

    return axios.get(
        `${API}/medicines?search=${encodeURIComponent(search)}`
    );

};


// =====================================
// Get Single Medicine
// =====================================

export const getMedicineById = (id, params = {}) => {

    return axios.get(
        `${API}/medicine/${id}`,
        { params }
    );

};


// =====================================
// Get Vendor / Pharmacy Medicines
// =====================================

export const getVendorMedicines = (vendorId) => {

    return axios.get(
        `${API}/pharmacy/${vendorId}/medicines`
    );

};


// =====================================
// Get Nearby Pharmacies
// =====================================

export const getNearbyPharmacies = (
    latitude,
    longitude,
    radius = "all"
) => {

    return axios.get(
        `${API}/nearby-pharmacies`,
        {
            params: {
                latitude: latitude || undefined,
                longitude: longitude || undefined,
                radius
            }
        }
    );

};

// =====================================
// Get Customer Profile
// =====================================

export const getCustomerProfile = (userId) => {

    return axios.get(
        `${API}/profile/${userId}`
    );

};


// =====================================
// Update Customer Profile
// =====================================

export const updateCustomerProfile = (userId, data) => {

    return axios.put(
        `${API}/profile/${userId}`,
        data
    );

};