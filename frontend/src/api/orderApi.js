import API from "./axios";

// Get All Orders
export const getOrders = () =>
    API.get("/orders");

// Get Single Order
export const getOrder = (id) =>
    API.get(`/orders/${id}`);

// Create Order
export const addOrder = (data) =>
    API.post("/orders", data);

// Vendor Orders
export const getVendorOrders = (vendorId) =>
    API.get(`/orders/vendor/${vendorId}`);

// Update Status
export const updateOrderStatus = (id, status) =>
    API.put(`/orders/${id}/status`, {
        status,
    });

// Delete Order
export const deleteOrder = (id) =>
    API.delete(`/orders/${id}`);