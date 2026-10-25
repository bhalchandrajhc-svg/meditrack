import API from "./axios";

// Get Vendor Notifications
export const getNotifications = (vendorId) =>
    API.get(`/notifications?vendor_id=${vendorId}`);

// Get Customer Notifications
export const getCustomerNotifications = (customerId) =>
    API.get(`/notifications/customer/${customerId}`);

// Create Notification
export const createNotification = (data) =>
    API.post("/notifications", data);

// Mark Notification as Read
export const markAsRead = (id) =>
    API.put(`/notifications/read/${id}`);

// Delete Notification
export const deleteNotification = (id) =>
    API.delete(`/notifications/${id}`);