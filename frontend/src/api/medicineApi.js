import API from "./axios";

// ============================
// Get All Medicines
// ============================

export const getMedicines = () => {

    const vendor = JSON.parse(localStorage.getItem("vendor"));

    return API.get(`/medicines/vendor/${vendor.id}`);

};

// ============================
// Get Single Medicine
// ============================

export const getMedicine = (id) => {

    return API.get(`/medicines/single/${id}`);

};

// ============================
// Add Medicine
// ============================

export const addMedicine = (formData) => {

    return API.post("/medicines", formData, {

        headers: {

            "Content-Type": "multipart/form-data"

        }

    });

};

// ============================
// Update Medicine
// ============================

export const updateMedicine = (id, formData) => {

    return API.put(`/medicines/${id}`, formData, {

        headers: {

            "Content-Type": "multipart/form-data"

        }

    });

};

// ============================
// Delete Medicine
// ============================

export const deleteMedicine = (id) => {

    return API.delete(`/medicines/${id}`);

};

// ============================
// Toggle Visibility
// ============================

export const toggleMedicineVisibility = (id) => {

    return API.put(`/medicines/visibility/${id}`);

};