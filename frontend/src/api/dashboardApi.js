import API from "./axios";

export const getDashboardSummary = (vendorId) =>
    API.get(`/dashboard/summary/${vendorId}`);

export const getRecentOrders = (vendorId) =>
    API.get(`/dashboard/recent-orders/${vendorId}`);

export const getLowStock = (vendorId) =>
    API.get(`/dashboard/low-stock/${vendorId}`);