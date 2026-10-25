import API from "./axios";

// Vendor Login
export const vendorLogin = (data) => {
    return API.post("/vendor/login", data);
};

// Vendor Register
export const registerVendor = (formData) => {
    return API.post("/vendor/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Get Vendor Profile
export const getVendorProfile = (id) => {
    return API.get(`/vendor/${id}`);
};

// Update Vendor Profile
export const updateVendorProfile = (id, formData) => {
    return API.put(`/vendor/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Change Password
export const changeVendorPassword = (id, data) => {
    return API.put(`/vendor/change-password/${id}`, data);
};